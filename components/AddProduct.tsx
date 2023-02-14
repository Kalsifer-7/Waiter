import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from '@material-ui/core/transitions';
import { DialogTitle, Dialog, Slide, Paper, TextField, MenuItem, InputAdornment, IconButton, FormControl, Button, LinearProgress, Typography }  from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SendIcon from '@material-ui/icons/Send';
import { Product, ProductKind, Error, isError } from '../lib/API';
import { FileUpload } from "./FileUpload";

const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: theme.typography.fontSize,
        marginTop: theme.spacing(3),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    input: {
        marginTop: "1vw",
        marginBottom: "5px",
        margin: "0.2vw",
        [theme.breakpoints.down('sm')]: {
            marginTop: "2vw",
            marginBottom: "1vw",
          }
    },
    ingredient: {
        marginTop: "5px",
        marginBottom: "5px",
        margin: "0.2vw",
    }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) 
{
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props{
    addMenuItem(prod: Omit<Product, 'id'>): Promise<Product | Error>,
	onClose(): void,
	open: boolean,
}

export function AddProduct(props: Props) {
    const { onClose, open } = props;
    const classes = useStyles();
    const [ ingredientsNumber, setIngredientsNumber ] = React.useState(0);
    const [ name, setName ] = React.useState<string>();
    const [ image, setImage ] = React.useState<ArrayBuffer>();
    const [ ingredients, setIngredients ] = React.useState<string[]>();
    const [ kind, setKind ] = React.useState<string>("available");
    const [ maxNumber, setMaxNumber ] = React.useState<number>();
    const [ price, setPrice ] = React.useState<number>();
    const [fileLoading, setFileLoading] = React.useState<boolean>(false);
    
    const genericStringPattern: RegExp = /\w{1,16}/;

    const nameHandler = (value: any) => {
        if (genericStringPattern.test(value)) {
            setName(value);
        }
    }
    
    const fileHandler = async (file: File) => {
        setFileLoading(true);
        setImage(await file.arrayBuffer());
        setFileLoading(false);
    }
    
    const ingredientsHandler = (index: number, value: string) => {
        if(!ingredients){ //undefined
            setIngredients( [value] );
            return;
        }
        else if(ingredients.length <= ingredientsNumber){
            setIngredients( ingredients.concat(value) );
            return;
        }
        setIngredients( ingredients.map( (x: string) => { return ingredients.indexOf(x) == index ? value : x} ) );
    }

    const stringIsKind = (kind: string | undefined): kind is ProductKind => {
        if(kind){
            return ["available", "orderable", "beverage"].includes(kind);
        } else {
            return false;
        }
    }
    const kindHandler = (value: any) => {
        if (stringIsKind(value)) {
            setKind(value);   
        }
    }

    const maxNumberHandler = (value: any) => {
        const valueN: number = parseInt(value);
        if (valueN > 0 && valueN < 256) {
            setMaxNumber(valueN);
        }
    }

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={onClose}
			fullWidth={true}
			maxWidth={"lg"}>
			<DialogTitle><Typography variant="h2">Aggiungi prodotto</Typography></DialogTitle>
			<Paper className={classes.root} elevation={10}>
                <FormControl className={classes.input}>
                    <TextField
                        required
                        label="Nome"
                        placeholder="Nome prodotto"
                        variant="outlined" 
                        color="secondary"
                        InputLabelProps={{shrink: true}}
                        onChange={ (e) => {nameHandler(e.target.value)} }
                    />
                </FormControl>
                <FormControl className={classes.input}>
                    <FileUpload fileHandler={fileHandler}></FileUpload>
                    { fileLoading && (
                        <LinearProgress color="secondary" />
                    )}
                </FormControl>
                <FormControl className={classes.input}>
                    <TextField
                        className={classes.input}
                        label="Ingredienti"
                        placeholder="Nome ingrediente"
                        variant="outlined"
                        color="secondary"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            endAdornment: ingredientsNumber < 1 ? 
                                <InputAdornment position="end"><IconButton onClick={() => { setIngredientsNumber(ingredientsNumber + 1) } }><AddIcon/></IconButton></InputAdornment>
                                :
                                <InputAdornment position="end">
                                    <IconButton onClick={() =>
                                        { 
                                            setIngredientsNumber(ingredientsNumber - 1);
                                            if(ingredients){
                                                setIngredients( ingredients.slice(0, ingredients.length - 1) );
                                            }
                                        } 
                                    }>
                                        <RemoveIcon color="primary"/>
                                    </IconButton>
                                </InputAdornment> 
                        }}
                        onChange={ (e) => ingredientsHandler(0, e.target.value)}
                    />
                    {
                        Array.from({length: ingredientsNumber}, (x, i) => i).map((x: number) =>
                            <TextField
                                key={x}
                                className={classes.ingredient}
                                label="Ingredients"
                                placeholder="Tonno"
                                variant="outlined"
                                color="secondary"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: 
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => { setIngredientsNumber(ingredientsNumber + 1) } }>
                                                <AddIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                onChange={ (e) => {ingredientsHandler(x + 1, e.target.value)} }
                            />
                        )
                    }
                </FormControl>
                <FormControl className={classes.input}>
                    <TextField
                        required
                        select
                        label="Tipologia"
                        variant="outlined"
                        color="secondary"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={kind}
                        onChange={ (e) => {kindHandler(e.target.value)} }
                    >
                        <MenuItem value={"available"}>
                            <Typography variant="h5">Disponibile</Typography>
                        </MenuItem>
                        <MenuItem value={"orderable"}>
                            <Typography variant="h5">Ordinabile</Typography>
                        </MenuItem>
                        <MenuItem value={"beverage"}>
                            <Typography variant="h5">Bibita</Typography>
                        </MenuItem>
                    </TextField>
                </FormControl>
                <FormControl className={classes.input}>
                    <TextField
                        type="number"
                        label="Numero massimo"
                        placeholder="99"
                        variant="outlined"
                        color="secondary" 
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => {maxNumberHandler(e.target.value)}}
                    />
                </FormControl>
                <FormControl className={classes.input}>
                    <TextField
                        required
                        type="number"
                        label="Prezzo"
                        placeholder="1.50"
                        variant="outlined"
                        color="secondary"
                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start">€</InputAdornment>
                        }}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                </FormControl>
                <FormControl className={classes.input}>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<SendIcon/>}
                        onClick={ async () => {                
                                if(name && image && stringIsKind(kind) && maxNumber && price){                           
                                    if(validate(name, ingredients, maxNumber, price)){
                                        await props.addMenuItem({
                                                kind: kind,
                                                name: name,
                                                price: Math.trunc(price * 100),
                                                ingredients: ( ingredients ? ingredients.join('\n') : null ),
                                                max_num: maxNumber,
                                                image: image,
                                        });
                                    }
                                }
                            }
                        }
                    >
                        Conferma
                    </Button>
                </FormControl>             
			</Paper>
		</Dialog>
	);
}

function validate(name: string, ingredients: string[] | undefined, maxNumber: number, price: number): boolean {
    let genericStringPattern: RegExp = /\w{1,16}/;
    let floatAboveZeroPattern: RegExp = /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/;
    if(
        genericStringPattern.test(name) &&
        (ingredients ? ingredients.every( (x:string) => { return genericStringPattern.test(x) } ) : true) &&
        floatAboveZeroPattern.test(maxNumber.toString()) &&
        floatAboveZeroPattern.test(price.toString())
       ) 
    {
        return true;
    }
    return false;
}