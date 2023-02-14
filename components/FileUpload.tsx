import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Typography } from "@material-ui/core"
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "10px",
        color: theme.palette.grey[500],
    },
    button: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        marginBottom: "10px",
        padding: "15px",
        //borderStyle: "solid",
        //borderWidth: "1px",
        color: theme.palette.grey[100],
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
        
    },
    sobstitute: {
        flexGrow: 1,
    },
    endIcon: {
        flexGrow: 0,
        marginLeft: "15px",
        color: theme.palette.grey[100],
    },
    hidden: {
        display: "none",
    },
}));

interface Props{
    fileHandler(file: File): void;
}

export function FileUpload (props: Props){
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined);

    const fileHandler = (event: any) => {
        const selectedFile = event.target.files[0];
        setSelectedFile(selectedFile);
        props.fileHandler(selectedFile);
    }

    return(
        <Paper className={classes.root}>
            <Paper elevation={3} className={classes.button}>
                <label htmlFor="upload-button" className={classes.sobstitute}><Typography>Image Upload</Typography> </label>
                <input id="upload-button" type="file" accept="image/*" className={classes.hidden} onChange={fileHandler}></input>
                <ImageIcon className={classes.endIcon}/>
            </Paper>

            { selectedFile ? (
                <Box>
                    <Typography>File name: {selectedFile.name}</Typography>
                    <Typography>File size: {(selectedFile.size / 1000000).toString().substr(0,4)}Mb</Typography>
                </Box>
            ) : (
                    <Typography>Select a file to show details</Typography>
            )}
        </Paper>        
    );
}
