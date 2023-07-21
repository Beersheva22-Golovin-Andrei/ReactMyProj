import { Alert, Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, Snackbar, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InputResult from "../../model/InputResult";
import { useRef, useState } from "react";
import LoginData from "../../model/LoginData";
import { StatusType } from "../../model/StatusType";
import UserData from "../../model/UserData";
const defaultTheme = createTheme();
type Props = {
    submitFn: (user: UserData) => Promise<InputResult>
}
const SignUpForm: React.FC<Props> = ({submitFn}) => {

  const message = useRef<string>('');
  const [open, setOpen] = useState(false);
  const severity = useRef<StatusType>('success');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       
        const data = new FormData(event.currentTarget);
        const name: string = data.get('name')! as string;
        const lastName: string = data.get('lastName')! as string;
        const email: string = data.get('email')! as string;
        const password: string = data.get('password')! as string;
        const address: string = data.get('address')! as string;
        
        const result:InputResult = await submitFn({name, lastName, email, password, address}); 
        message.current = result.message!;
        severity.current = result.status;
        message.current && setOpen(true);
    };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AccountBoxIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="address"
                  type="address"
                  id="address"
        
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
         
        </Box>
    
      </Container>
      <Snackbar open={open} autoHideDuration={3000}
                     onClose={() => setOpen(false)}>
                        <Alert  onClose = {() => setOpen(false)} severity={severity.current} sx={{ width: '100%' }}>
                            {message.current}
                        </Alert>
                    </Snackbar>
    </ThemeProvider>
  );

}
 
 export default SignUpForm;