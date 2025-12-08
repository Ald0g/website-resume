// // import { useState } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import portrait from '/src/assets/portrait.jpeg'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
// import EngineeringIcon from '@mui/icons-material/Engineering';

// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import Diversity2Icon from '@mui/icons-material/Diversity2';
// import GroupsIcon from '@mui/icons-material/Groups';



import CareerTimeline from './CareerTimeline';

function App() {

  return (
    <>
      <Stack sx={{alignItems: 'center'}}>
        <Box sx={{width:0.3}}>
          <img src={portrait} style={{width: '100%', borderRadius: '30%'}}></img>
        </Box>
        {/* <Avatar alt="Remy Sharp" src="/src/assets/portrait.jpeg"/> */}
        <h1>Mark Lenzner</h1>
        
      </Stack>
      <CareerTimeline></CareerTimeline>
    </>
  )
}

export default App
