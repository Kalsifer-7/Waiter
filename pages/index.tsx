import Head from "next/head";
import { useRouter } from "next/router";
import React from 'react';
import { Box, Button, Divider, Paper, Typography } from '@material-ui/core';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { STORAGE_KEYS, useGoogleProfile } from "../lib/useGoogleProfile";
import style from '../styles/Index';
import { SnackbarKey, useSnackbar } from 'notistack';
import { Error } from "../lib/API";

export default function Home() {
  const classes = style();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const googleFail = (error: Error) => {
    enqueueSnackbar(<Typography>Accesso non riuscito<Divider />{error.reason} <Divider />{error.message}</Typography>,{
      preventDuplicate: true,
      variant: 'error',
      autoHideDuration: 2000,
    });
  }

  const googleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if(isOnlineResponse(response)){
			if(process.env.NEXT_PUBLIC_DOMAIN && response.getHostedDomain() != process.env.NEXT_PUBLIC_DOMAIN){
        enqueueSnackbar(<Typography>Accesso non riuscito</Typography>,{
          preventDuplicate: true,
          variant: 'error',
          autoHideDuration: 2000,
        });
				return;
			}
      [
        [STORAGE_KEYS.ACCESSTOKEN, response.accessToken],
        [STORAGE_KEYS.TOKENEXPIRESAT, response.tokenObj.expires_at.toString()],
      ].forEach(
        (storageItem) => window.localStorage.setItem(
          storageItem[0], storageItem[1]
        )
      );
      enqueueSnackbar('Accesso riuscito',{
				preventDuplicate: true,
				variant: 'success',
				autoHideDuration: 2000,
			});
			router.push("/bar");
    } else {
      enqueueSnackbar(<Typography>Accesso non riuscito</Typography>,{
        preventDuplicate: true,
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  }

  const action = (key: SnackbarKey) => (
    <React.Fragment>
        <Button onClick={() => { closeSnackbar(key) }}>
        <Typography variant="h6" className={classes.dismiss}>Nascondi</Typography>
        </Button>
    </React.Fragment>
  );

	React.useEffect(
		() => {
			if(process.env.BUILD_AUTH){
				const profile = useGoogleProfile();
				if(profile !== null){
						//Should spawn a prompt
						router.push("/bar");
				}
			}
			enqueueSnackbar(<Typography>Il sito é attualmente in sviluppo,<br/>per eventuali feedback(bugs, features)<br/>contattare kalsifer742@gmail.com</Typography>,{
				preventDuplicate: true,
				variant: 'warning',
				autoHideDuration: 2000,
        action,
			});
		}
	);

  return (
    <React.Fragment>
      <Head>
        <title>Accesso</title>
      </Head>
      <Box className={classes.background}>
        <Paper className={classes.root} elevation={15}>
          <img className={classes.avatar} src="/assets/misc/rossi.svg"></img>

          <Typography variant="h1" className={classes.title}>
            Entra nel sito
          </Typography>

          <GoogleLogin className={classes.button}
            //Take client id from .env
            clientId={
              process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === undefined? "" : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
            }
            buttonText="Accedi con Google"
            onSuccess={googleSuccess}
            onFailure={googleFail}
            responseType="token"
            hostedDomain={process.env.NEXT_PUBLIC_DOMAIN}
            //cookiePolicy={'single_host_origin'}
          />

          <Typography variant="subtitle1" className={classes.subtitle}>
            É possibile accedere sono con gli account di istituto autorizzati (es. 1234567@itisrossi.vi.it)
          </Typography>
        </Paper>
      </Box>
    </React.Fragment>
  );
}

function isOnlineResponse(resp: GoogleLoginResponse | GoogleLoginResponseOffline): resp is GoogleLoginResponse {
  return (resp as any).accessToken != undefined;
}
