const Details = ({ path, objectId, id }) => {

  return (
    <div className="bg-sidelayoutColor dark:bg-dark-300">
    <div className="rounded-tl-xl bg-cleanWhite dark:bg-dark-200">
      {env.DATA_SOURCE_SET !== true ? (
        <ApiDetails objectId={objectId} path={path} id={id} />
      ) : (
        <ModuleDetails objectId={objectId} path={path} id={id} />
      )
      }
    </div>
    </div>
  );
};
