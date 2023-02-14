import React from "react";
import { TransitionProps } from '@material-ui/core/transitions';
import { List, DialogTitle, Dialog, Typography, Button, CardContent, Slide, Paper, IconButton, ListItem, Box, FormControl, TextField, MenuItem, Divider }  from "@material-ui/core";
import { API as WaiterAPI, Error, isError, Product } from "../lib/API";
import { ProductCard } from "./ProductCard";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import DeleteIcon from '@material-ui/icons/Delete';
import style from '../styles/Cart'
import ProductCartStyle from '../styles/ProductCart';
import { useSnackbar } from "notistack";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) 
{
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props{
	close(): void;
	open: boolean;
	api: WaiterAPI | Error;
	cart: [number, number][];
	setCart(cart: [number, number][]): void;
	totalItems: any,
	totalPrice: any,
	menu: Product[]
}

export function Cart(props: Props) {
	const { close, open, api, cart, setCart, totalPrice, totalItems, menu } = props;
	const classes = style();
	const classesProductCard = ProductCartStyle();
	const [, setQuantity] = React.useState(1);
	const [turn, setTurn] = React.useState<string>("1");
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		close();
	};

	async function handleOrder() {
		if (api && !isError(api)) {
			if (cart.length > 0) {
				await api.addOrder(turn == "1" ? true : false, cart);
				setCart([]);
				if (isError(api)) {
					enqueueSnackbar(<Typography>Ordine non riuscito<Divider />{api.reason}<Divider />{api.message}</Typography>, {
						preventDuplicate: true,
						variant: 'error',
						autoHideDuration: 2000,
					});
				}
				enqueueSnackbar(<Typography>Ordine riuscito</Typography>, {
					preventDuplicate: true,
					variant: 'success',
					autoHideDuration: 2000,
				});
			} else {
				enqueueSnackbar(<Typography>Ordine non riuscito<Divider/>Nessun prodotto selezionato</Typography>, {
					preventDuplicate: true,
					variant: 'warning',
					autoHideDuration: 2000,
				});
			}
		}
		close();
	}

	const handleDelete = (id: number) => {
		setCart(cart.filter((item: [number, number]) => item[0] !== id));
	}

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			fullWidth={true}
			maxWidth={"lg"}>
			<DialogTitle><Typography variant="h2">Carrello</Typography></DialogTitle>
			<List className={classes.list}>
				{cart && cart.map((product: [number, number]) => (
					<ListItem className={classes.list}>
						<ProductCard
							key={product[0]}
							product={menu[product[0]]}
							style={ProductCartStyle}
						>
							<React.Fragment>
								<IconButton
									onClick={() => { 
										setQuantity(product[1] -= 1);
										setCart(cart);
									}}
									disabled={product[1] < 2}
								>
									<RemoveCircle className={classesProductCard.button} />
								</IconButton>
								<Typography className={classesProductCard.quantity}> {product[1]} </Typography>
								<IconButton
									onClick={() => {
										setQuantity(product[1] += 1);
										setCart(cart);
									}}
								>
									<AddCircle className={classesProductCard.button} />
								</IconButton>
								<IconButton className={classesProductCard.delete} onClick={ () => {handleDelete(product[0])} }>
									<DeleteIcon />
								</IconButton>
							</React.Fragment>	
						</ProductCard>
					</ListItem>
				))}
			</List>
			<Paper className={classes.card} elevation={10}>
				<Box className={classes.info}>
					<Box className={classes.infoContent}>
						<Typography className={classes.total}>Totale</Typography>
						<Typography className={classes.price}>{(totalPrice(cart, menu)/100).toFixed(2)}€</Typography>
					</Box>
					<Box className={classes.infoContent}>
						<Typography className={classes.total}>Oggetti</Typography>
						<Typography className={classes.price}>x{totalItems(cart)}</Typography>
					</Box>
					<Box className={classes.turn}>
						<Typography className={classes.total}>Turno</Typography>
						<FormControl className={classes.price}>
							<TextField
								required
								select
								variant="outlined"
								color="secondary"
								value={turn}
								onChange={ (e) => setTurn(e.target.value as string) }
							>
									<MenuItem value={1}>
										<Typography variant="h5">Primo turno</Typography>
									</MenuItem>
									<MenuItem value={0}>
										<Typography variant="h5">Secondo turno</Typography>
									</MenuItem>
							</TextField>
                		</FormControl>
					</Box>
					<Button className={classes.button} type="submit" variant="contained" size="large" onClick={handleOrder}>
						<Typography variant="h4">Conferma Ordine</Typography>
					</Button>
				</Box>
			</Paper>
		</Dialog>
	);
}