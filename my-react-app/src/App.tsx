// // import { useState } from 'react'
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { Avatar, Box, Stack } from '@mui/material';
import portrait from '/src/assets/portrait.jpeg'


function App() {

  return (
    <>
      <Stack sx={{alignItems: 'center'}}>
        <Box sx={{width:0.5}}>
          <img src={portrait} style={{width: '100%', borderRadius: '30px'}}></img>
        </Box>
        {/* <Avatar alt="Remy Sharp" src="/src/assets/portrait.jpeg"/> */}
        <h1>Mark Lenzner</h1>
        
      </Stack>
    </>
  )
}

export default App
