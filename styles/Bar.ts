import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    appBar: {
      marginBottom: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
    },
    tabs: {
      flexGrow: 1,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    tabPanel:{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "flex-start"
  }
  }));