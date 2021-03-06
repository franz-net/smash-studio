import {AccessTimeFilled, FactCheck, SportsTennis} from "@mui/icons-material";
import {Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography} from "@mui/material";
import {deepPurple, green} from "@mui/material/colors";
import {format} from "date-fns-tz";
import {useAppContext} from "../context/appContext";
import {Link} from "react-router-dom";
import {add} from "date-fns";

export default function Reservation({id, courtId, date, status, updatedAt, duration, Court}: any) {

    const {courtName, courtType} = courtId
    const {setEditReservation, deleteReservation, timezone} = useAppContext()
    let resDate = new Date(date)
    
    return (
        <Card
            sx={{
                maxWidth: {xs: 325, md: 450},
                background: '#fff',
                m: {xs: 2, md: 5}
            }}
        >
            <CardContent>
                <Grid container spacing={{xs: 1, md: 3}} sx={{m: {xs: 0, md: 1}}}>
                    {/* title row */}
                    <Grid item xs={3} md={2}>
                        <Avatar
                            variant='square'
                            sx={{
                                bgcolor: courtType === 'tennis' ? deepPurple[800] : green[800],
                                borderRadius: '15%'
                            }}
                        >
                            {Court.courtType[0].toUpperCase()}
                        </Avatar>
                    </Grid>
                    <Grid item xs={9} md={9}>
                        <Typography variant="h5" sx={{fontWeight: 700}} gutterBottom color="text.primary">
                            {format(resDate, 'MMM do, yyyy')}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider variant="middle" sx={{mt: 2}}></Divider>
                <Grid container spacing={{xs: 1, md: 3}} sx={{m: {xs: 0, md: 1}}}>
                    {/* details row */}

                    <Grid item xs={6} md={5}>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <AccessTimeFilled sx={{mr: 2}}/>
                            <Typography variant="subtitle1" color="text.secondary">
                                Start: {format(resDate, 'HH:mm')}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <AccessTimeFilled sx={{mr: 2}}/>
                            <Typography variant="subtitle1" color="text.secondary">
                                End: {format(add(resDate, {hours: duration}), 'HH:mm')}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Updated at row */}

                    <Grid item xs={6} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <SportsTennis sx={{mr: 2}}/>
                            <Typography variant="subtitle1" color="text.secondary">
                                Court: {Court.courtName}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <FactCheck sx={{mr: 2}}/>
                            <Typography variant="subtitle1" color="text.secondary">
                                {status}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* buttons row */}

                    <Grid item xs={12} md={10}>
                        <Box component="div"
                             sx={{
                                 mt: 2,
                                 display: 'flex',
                                 justifyContent: 'center'
                             }}>
                            <Button
                                component={Link}
                                size='small'
                                variant="contained"
                                color="secondary"
                                sx={{mr: 2}}
                                to="/add-reservation"
                                onClick={() => setEditReservation(id, courtType)}

                            >
                                Update
                            </Button>
                            <Button
                                size='small'
                                variant="contained"
                                color="error"
                                onClick={() => deleteReservation(id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}