import { Toolbar } from "@material-ui/core";

interface Props{
  children: React.ReactNode,
  style: any
}

export function CustomToolBar(props: Props){
  const { children, style } = props;

  return (
    <Toolbar className={style}>
      {children}
    </Toolbar>
  );
};