import React from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import Box from '@material-ui/core/Box';
import style from '../styles/Bar';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Typography, IconButton, AppBar, Toolbar, Tabs, Tab, Button, Collapse, CardContent, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Divider } from '@material-ui/core';
import { Cart } from '../components/Cart'
import { useGoogleProfile, getTestProfile } from "../lib/useGoogleProfile";
import { useAPI, API as WaiterAPI, Product, Error, isError } from "../lib/API";
import { ProductCard } from '../components/ProductCard';
import ProductBarStyle from '../styles/ProductBar';
import { useSnackbar } from 'notistack';
import { TabPanel } from '../components/TabPanel';
import { ExpandButton } from '../components/ExpandButton';
import { totalItems, totalPrice } from '../lib/Miscellaneus';
import { Ingredients } from '../components/Ingredients';

export default function Page() {
  const classes = style();
  const [value, setValue] = React.useState<number>(0);
  const [id, setId] = React.useState<number>();
  const [open, setOpen] = React.useState<boolean>(false);
	const profile = process.env.NODE_ENV === 'production' ? useGoogleProfile() : getTestProfile();
	const [api, setAPI] = React.useState<WaiterAPI | Error>();
  const [menu, setMenu] = React.useState<Product[] | Error>();
  const [cart, setCart] = React.useState<[number, number][]>([]);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
 
	React.useEffect(
			api === undefined ? () => {
				if(typeof profile === 'object'){
					useAPI(profile).then(setAPI);
				} else if(typeof profile === 'string') {
					router.replace("/")
				}
			} : () => {
        if (menu === undefined && !isError(api)) {
					api.getMenu().then(setMenu);
        }
        else if(isError(api)){
          enqueueSnackbar(<Typography>Impossibile caricare la lista prodotti<Divider />{api.reason}<Divider />{api.message}</Typography>,{
            preventDuplicate: true,
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
			}
	);
		
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBuyClick = (product: Product) => {
    let index: number;
    if (cart && (index = cart.findIndex((item: [number, number]) => { return product.id == item[0]; })) != -1) {
      cart[index][1] += 1;
      setCart(cart);
    } else {
      setCart([...cart, [product.id, 1]]);
    }
  };

  const handleExpandClick = (id: number) => {
    setId(id);
    setExpanded(!expanded);
	};

  return (
    <React.Fragment>
      <Head>
        <title>Bar</title>
      </Head>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
					<Typography variant="h1" className={classes.title}>
            Bar
          </Typography>
          <Tabs value={value} onChange={handleChange} className={classes.tabs} variant="scrollable" scrollButtons="auto">
            <Tab label="Disponibili"/>
            <Tab label="Ordinabili"/>
            <Tab label="Bibite"/>
          </Tabs>
					{
            api && menu && !isError(menu) &&
              <React.Fragment>
                <IconButton onClick={handleClickOpen}>
                  <ShoppingCartIcon color="secondary"/>
                </IconButton>
                <Cart open={open} close={handleClose} api={api} cart={cart} setCart={setCart} menu={menu} totalItems={totalItems} totalPrice={totalPrice}/>
              </React.Fragment>
					}
        </Toolbar>
      </AppBar>
      {
        menu && !isError(menu) ?
        <React.Fragment>
          <TabPanel value={value} index={0} style={classes.tabPanel}>
            {
              menu.filter((item: Product) => item.kind === "available")
              .map((item: Product) =>
                <ProductCard key={item.id} product={item} style={ProductBarStyle} collapse={
                  <Collapse in={expanded && item.id == id} timeout="auto" unmountOnExit>
                      <CardContent>
                        {item.ingredients && <Ingredients ingredients={item.ingredients}></Ingredients>}
                      </CardContent>
                  </Collapse>
                }>
                  <Button variant="contained" color="secondary" size="medium" onClick={() => handleBuyClick(item)}><Typography variant="h6">Acquista</Typography></Button>
                  <ExpandButton expanded={expanded} itemId={item.id} selectedId={id} handleExpandClick={handleExpandClick}></ExpandButton>
                </ProductCard>
              )
            }
          </TabPanel>
          <TabPanel value={value} index={1} style={classes.tabPanel}>
            {
              menu.filter((item: Product) => item.kind === "orderable")
                .map((item: Product) =>
                  <ProductCard key={item.id} product={item} style={ProductBarStyle} collapse={
                    <Collapse in={expanded && item.id == id} timeout="auto" unmountOnExit>
                        <CardContent>
                          {item.ingredients && <Ingredients ingredients={item.ingredients}></Ingredients>}
                        </CardContent>
                    </Collapse>
                  }>
                    <Button variant="contained" color="secondary" size="medium" onClick={() => handleBuyClick(item)}><Typography variant="h6">Acquista</Typography></Button>
                    <ExpandButton expanded={expanded} itemId={item.id} selectedId={id} handleExpandClick={handleExpandClick}></ExpandButton>
                  </ProductCard>
                )
              }
          </TabPanel>
          <TabPanel value={value} index={2} style={classes.tabPanel}>
            {
              menu.filter((item: Product) => item.kind === "beverage")
                .map((item: Product) =>
                  <ProductCard key={item.id} product={item} style={ProductBarStyle} collapse={
                    <Collapse in={expanded && item.id == id} timeout="auto" unmountOnExit>
                        <CardContent>
                          {item.ingredients && <Ingredients ingredients={item.ingredients}></Ingredients>}
                        </CardContent>
                    </Collapse>
                  }>
                    <Button variant="contained" color="secondary" size="medium" onClick={() => handleBuyClick(item)}><Typography variant="h6">Acquista</Typography></Button>
                    <ExpandButton expanded={expanded} itemId={item.id} selectedId={id} handleExpandClick={handleExpandClick}></ExpandButton>
                  </ProductCard>
                )
              }
          </TabPanel>
        </React.Fragment>
          :
        <LinearProgress color="secondary"/>
      }
    </React.Fragment>
  )
}