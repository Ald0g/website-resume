import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, Stack, Container } from '@mui/material';
import portrait from '/src/assets/portrait.jpeg'
import CareerTimeline from './CareerTimeline';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 0.3 }}>
                    <Link to="/game">
                        <img src={portrait} style={{ width: '100%', borderRadius: '30%', cursor: 'pointer' }} alt="Mark Lenzner" />
                    </Link>
                </Box>
                <h1>Mark Lenzner</h1>
            </Stack>
            <CareerTimeline></CareerTimeline>
        </Container>
    )
}

export default Home
