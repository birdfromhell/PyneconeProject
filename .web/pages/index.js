import {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {E, connect, updateState, uploadFiles} from "/utils/state"
import "focus-visible/dist/focus-visible"
import {Box, Center, Code, Heading, Link, VStack, useColorMode} from "@chakra-ui/react"
import NextLink from "next/link"
import NextHead from "next/head"

const PING = "http://localhost:8000/ping"
const EVENT = "ws://localhost:8000/event"
const UPLOAD = "http://localhost:8000/upload"
export default function Component() {
const [state, setState] = useState({"events": [{"name": "state.hydrate"}], "files": []})
const [result, setResult] = useState({"state": null, "events": [], "processing": false})
const router = useRouter()
const socket = useRef(null)
const { isReady } = router;
const { colorMode, toggleColorMode } = useColorMode()
const Event = events => setState({
  ...state,
  events: [...state.events, ...events],
})
const File = files => setState({
  ...state,
  files,
})
useEffect(() => {
  if(!isReady) {
    return;
  }
  if (!socket.current) {
    connect(socket, state, setState, result, setResult, router, EVENT, ['websocket', 'polling'])
  }
  const update = async () => {
    if (result.state != null) {
      setState({
        ...result.state,
        events: [...state.events, ...result.events],
      })
      setResult({
        state: null,
        events: [],
        processing: false,
      })
    }
    await updateState(state, setState, result, setResult, router, socket.current)
  }
  update()
})
return (
<Center sx={{"paddingTop": "10%"}}><VStack spacing="1.5em"
sx={{"fontSize": "2em"}}><Heading sx={{"fontSize": "2em"}}>{`Welcome to Pynecone!`}</Heading>
<Box>{`Get started by editing `}
<Code sx={{"fontSize": "1em"}}>{`PyneconeProject/PyneconeProject.py`}</Code></Box>
<NextLink href="https://pynecone.io/docs/getting-started/introduction"
passHref={true}><Link sx={{"border": "0.1em solid", "padding": "0.5em", "borderRadius": "0.5em", "_hover": {"color": "rgb(107,99,246)"}}}>{`Check out our docs!`}</Link></NextLink></VStack>
<NextHead><title>{`Pynecone App`}</title>
<meta content="A Pynecone app."
name="description"/>
<meta content="favicon.ico"
property="og:image"/></NextHead></Center>
)
}