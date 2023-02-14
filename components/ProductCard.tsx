import React from 'react';
import { Typography, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { Product } from '../lib/API'
type CartItem = [Product, number];

interface Props {
	product: Product | CartItem,
	quantity?: React.ReactNode | undefined,
	collapse?: React.ReactNode | undefined,
	children?: React.ReactNode | undefined, //actions
	style: any,
}

export function ProductCard(props: Props) {
	const { quantity, collapse, children, style } = props;
	let product: CartItem;
	if(!Array.isArray(props.product)){
		product = [props.product, 1];	
	} else {
		product = props.product;
	}

	const classes = style();
	const [image, setImage] = React.useState<string | undefined>();

	React.useEffect(
		()=>{
			if(!image){
				setImage(URL.createObjectURL(new Blob([product[0].image], { type: 'image/png' })));
			}
			return ()=>{
				if(image){
					URL.revokeObjectURL(image);
				}
			}
		}
	)

	return (
		<Card className={classes.root}>
			{image && <CardMedia className={classes.media} image={image}/>}
			<CardContent className={classes.content}>
				<Typography variant="h3" className={classes.name}>
					{product[0].name}
				</Typography>
				<Typography variant="h5" className={classes.price}>
					{((product[0].price/100) * product[1]).toFixed(2)}€
				</Typography>
				{quantity}
			</CardContent>
			<CardActions disableSpacing className={classes.actions}>
				{children}
			</CardActions>
			{collapse}
		</Card>
	);
}