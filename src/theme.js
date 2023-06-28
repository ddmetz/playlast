import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    config: {
      cssVarPrefix: "ck",
      initialColorMode: "system",
      useSystemColorMode: false,
    },
  });

export default theme