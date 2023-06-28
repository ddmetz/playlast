import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  extendTheme,
  Grid,
  GridItem,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Link,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Divider,
  Text,
  HStack,
  Box,
  Flex,
  Spacer,
  SimpleGrid,
  Center,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

import {
  ChevronDownIcon,
  TimeIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";

import "./index.css";
import { GeneralTable } from "./components/table/general-table";

import theme from "./theme";

const placeholderAlbumArt = require("./static/placeholder-album-art.png");

function App() {
  const CLIENT_ID = "9ce7fc97485342b4ac6e3ae3666653bb";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = ["playlist-read-private"].join("%20"); // join with space delimiter

  const LASTFM_API_KEY = "bf66e9302e019074df8bbcbdecc64104";

  const { colorMode, toggleColorMode } = useColorMode();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [currentSpotifyPlaylist, setCurrentSpotifyPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [lastfmUsername, setLastfmUsername] = useState("");
  const [lastfmPeriod, setLastfmPeriod] = useState("7day");
  const [lastfmTopTracks, setLastfmSongs] = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [lastfmLoading, setLastfmLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    let spotifyToken = window.localStorage.getItem("spotifyToken");

    // getToken()

    if (!spotifyToken && hash) {
      spotifyToken = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("spotifyToken", spotifyToken);
    }

    setSpotifyToken(spotifyToken);
  }, []);

  const spotifyLogout = () => {
    setSpotifyToken("");
    window.localStorage.removeItem("spotifyToken");
  };

  const getTopTracks = async () => {
    let topTracks = [];
    let hasNext = true;
    let page = 1;
    let url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${lastfmUsername}&period=${lastfmPeriod}&page=${page}&api_key=${LASTFM_API_KEY}&format=json`;
    while (hasNext) {
      const { data } = await axios.get(url, {
        params: {
          limit: 50,
        },
        crossDomain: true,
      });
      topTracks = topTracks.concat(data.toptracks.track);
      if (data["toptracks"]["@attr"]["totalPages"] != page) {
        page += 1;
        url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${lastfmUsername}&period=${lastfmPeriod}&page=${page}&api_key=${LASTFM_API_KEY}&format=json`;
      } else {
        hasNext = false;
      }
    }
    return topTracks;
  };

  const loadTopTracks = async (e) => {
    e.preventDefault();
    setLastfmLoading(true);
    try {
      if (lastfmUsername) {
        let tracks = await getTopTracks();
        if (!tracks) {
          console.log("no tracks");
          return;
        }
        setLastfmSongs(tracks);
        setPlaylistTracks(playlistTracks.concat([]));
        toast({
          title: "Success",
          description: `Loaded Last.fm data for '${lastfmUsername}'`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Error loading Last.fm data '${lastfmUsername}'`,
        description: `Perhaps there is an adblocker blocking the request?`,
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setLastfmLoading(false);
    }
  };

  const getAllSpotifyPlaylists = async () => {
    var temp = [];
    var hasNext = true;
    var url = "https://api.spotify.com/v1/me/playlists";
    while (hasNext) {
      const { data } = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
          params: {
            limit: 50,
          },
        })
        .catch((error) => {
          console.error("Error getting spotify playlists");
          console.error(error);
          return;
        });
      temp = temp.concat(data.items);
      if (data["next"]) {
        url = data["next"];
      } else {
        hasNext = false;
      }
    }
    return temp;
  };

  const searchSpotifyPlaylists = async (e) => {
    e.preventDefault();
    setSpotifyLoading(true);
    try {
      if (searchKey) {
        let playlists = await getAllSpotifyPlaylists();
        if (!playlists) {
          console.log("no playlists");
          return;
        }
        let a = playlists.filter(async (playlist) => {
          if (
            playlist.name.toLowerCase().indexOf(searchKey.toLowerCase()) != -1
          ) {
            setCurrentSpotifyPlaylist(playlist);
            let tracks = await getAllSpotifyPlaylistTracks(
              playlist.tracks.href
            );
            setPlaylistTracks(tracks);

            return true;
          }
          return false;
        });
        toast({
          title: "Success",
          description: `Loaded playlist`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error getting spotify playlists");
      console.error(error);
      spotifyLogout();
      return;
    } finally {
      setSpotifyLoading(false);
    }
  };

  const getAllSpotifyPlaylistTracks = async (url) => {
    try {
      var temp = [];
      var hasNext = true;
      while (hasNext) {
        const { data } = await axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
            params: {
              limit: 50,
            },
          })
          .catch((error) => {
            console.error("Error getting spotify playlists");
            console.error(error);
            return;
          });
        temp = temp.concat(data.items);
        if (data["next"]) {
          url = data["next"];
        } else {
          hasNext = false;
        }
      }
      return temp;
    } catch (error) {
      console.error("Error getting spotify playlists");
      console.error(error);
      return;
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("track.album.images.2.url", {
      cell: (info) => (
        <Image
          src={info.getValue() ? info.getValue() : String(placeholderAlbumArt)}
        ></Image>
      ),
      header: " ",
      size: 64,
    }),
    columnHelper.accessor("track.name", {
      cell: (info) => info.getValue(),
      header: "Title",
      size: 350,
    }),
    columnHelper.accessor("track.artists.0.name", {
      cell: (info) => info.getValue(),
      header: "Artist",
      size: 200,
    }),
    columnHelper.accessor("track.album.name", {
      cell: (info) => info.getValue(),
      header: "Album",
      size: 300,
    }),
    columnHelper.accessor("added_at", {
      cell: (info) => <Box width="13ch">{info.getValue().slice(0, -10)}</Box>,
      header: "Date added",
    }),
    {
      id: "scrobbles",
      accessorFn: (row) => {
        let value = 0;
        if (lastfmTopTracks) {
          const track = lastfmTopTracks.find((track) => {
            if (
              track.name.toLowerCase() == row.track.name.toLowerCase() &&
              track.artist.name.toLowerCase() ==
                row.track.artists["0"].name.toLowerCase()
            ) {
              return true;
            } else return false;
          });
          if (track) return track.playcount;
          else return 0;
        } else {
          return "";
        }
      },
    },
  ];

  const renderSpotifySearch = () => {
    return (
      <FormControl>
        <FormLabel>Select one of your Spotify playlists</FormLabel>
        <Flex>
          <Input
            type="text"
            placeholder="Playlist name"
            onChange={(e) => setSearchKey(e.target.value)}
            mr="0.5rem"
          />
          <Box>
            <Button
              colorScheme="purple"
              type="submit"
              onClick={searchSpotifyPlaylists}
              w="11rem"
              isLoading={spotifyLoading}
            >
              Search
            </Button>
          </Box>
        </Flex>
      </FormControl>
    );
  };

  const renderPeriodText = (period) => {
    switch (period) {
      case "overall":
        return "Overall";
      case "12month":
        return "12 Months";
      case "6month":
        return "6 Months";
      case "3month":
        return "3 Months";
      case "1month":
        return "1 Month";
      case "7day":
        return "7 Days";
      default:
        return "None";
    }
  };

  const renderLastfmSearch = () => {
    return (
      <>
        <FormLabel>Load Last.fm scrobbles</FormLabel>
        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<TimeIcon />}
              w="15rem"
              textTransform="capitalize"
            >
              {renderPeriodText(lastfmPeriod)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setLastfmPeriod("overall")}>
                Overall
              </MenuItem>
              <MenuItem onClick={() => setLastfmPeriod("12month")}>
                12 Months
              </MenuItem>
              <MenuItem onClick={() => setLastfmPeriod("6month")}>
                6 Months
              </MenuItem>
              <MenuItem onClick={() => setLastfmPeriod("3month")}>
                3 Months
              </MenuItem>
              <MenuItem onClick={() => setLastfmPeriod("1month")}>
                1 Month
              </MenuItem>
              <MenuItem onClick={() => setLastfmPeriod("7day")}>
                7 days
              </MenuItem>
            </MenuList>
          </Menu>
          <Input
            type="text"
            placeholder="Last.fm username"
            onChange={(e) => setLastfmUsername(e.target.value)}
            mx="0.5rem"
          />
          <Button
            colorScheme="pink"
            type="submit"
            onClick={loadTopTracks}
            w="15rem"
            isLoading={lastfmLoading}
          >
            Load Scrobbles
          </Button>
        </Flex>
      </>
    );
  };

  const renderSpotifyPlaylist = () => {
    return (
      <Center>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="none"
          w="100%"
        >
          <Image
            src={
              currentSpotifyPlaylist["images"].length
                ? currentSpotifyPlaylist["images"][0]?.url
                : ""
            }
            alt="Playlist Image"
            maxW={{ base: "50%", sm: "200px" }}
            borderRadius="lg"
          />
          <CardBody>
            <Stack spacing="0" gap="1rem">
              <Heading size="4xl">
                <a
                  href={currentSpotifyPlaylist["external_urls"]["spotify"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentSpotifyPlaylist["name"]}
                </a>
              </Heading>
              <Text fontSize="xl">
                {currentSpotifyPlaylist["tracks"].total} Tracks
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Center>
    );
  };

  return (
    <Container maxW="1280px" pt="1rem">
      <Grid rowGap="1rem">
        <GridItem>
          <Flex>
            <Heading>Playlast</Heading>
            <Spacer></Spacer>
            {!spotifyToken ? (
              <></>
            ) : (
              <Button variant="ghost" onClick={spotifyLogout}>
                {"Logout"}
              </Button>
            )}
            <Button onClick={toggleColorMode} variant="ghost">
              {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
            </Button>
          </Flex>
        </GridItem>
        {spotifyToken ? (
          <Grid gap="1rem" marginBottom="3rem">
            <GridItem>{renderSpotifySearch()}</GridItem>
            <GridItem>{renderLastfmSearch()}</GridItem>
            {currentSpotifyPlaylist["name"] ? (
              <>
                <GridItem>{renderSpotifyPlaylist()}</GridItem>

                <GridItem h="800px">
                  <GeneralTable columns={columns} data={playlistTracks} />
                </GridItem>
              </>
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <Grid gap="1rem">
            <Center pt="5rem">
              <Heading as="h3" size="lg">
                Please login with Spotify
              </Heading>
            </Center>
            <Center>
              <Button colorScheme="green">
                <a
                  href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
                >
                  Spotify Login
                </a>
              </Button>
            </Center>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
