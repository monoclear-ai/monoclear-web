/*
  Card component.
  
  Encapsulates a number of children with a shadow and rounded corners.
  Options:
    variant?: string - variant to apply to card
    extra?: string - extra classes to apply to card
    children?: JSX.Element | any[] - children to display in card
    [x: string]: any - other props to apply to card
*/
function Card(props: {
  variant?: string;
  extra?: string;
  children?: JSX.Element | any[];
  [x: string]: any;
}) {
  const { variant, extra, children, ...rest } = props;
  return (
    <div
      className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${extra}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
