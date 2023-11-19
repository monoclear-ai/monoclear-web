import Switch from "components/switch";

/*
  SwitchField for displaying switch fields.

  Options:
    id: string - id of switch field
    label: string - label of switch field
    desc: string - description of switch field
    placeholder: string - placeholder of switch field
    mt: any - margin top of switch field
    mb: any - margin bottom of switch field
*/
const SwitchField = (props: {
  id: string;
  label: string;
  desc: string;
  placeholder: string;
  mt: any;
  mb: any;
}) => {
  const { id, label, desc, mt, mb } = props;
  return (
    <div className={`flex justify-between ${mt} ${mb} items-center`}>
      <label
        htmlFor={id}
        className="max-w-[80%] hover:cursor-pointer lg:max-w-[65%]"
      >
        <h5 className="text-base font-bold text-navy-700 dark:text-white">
          {label}
        </h5>
        <p className={`text-base text-gray-600`}>{desc}</p>
      </label>
      <div>
        <Switch id={id} />
      </div>
    </div>
  );
};

export default SwitchField;
