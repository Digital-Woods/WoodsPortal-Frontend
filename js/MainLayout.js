class MainLayout extends React.Component {
  render() {
    return (
      <div>
        <ul role="nav">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/recoil-js">Recoil js</Link>
          </li>
          <li>
            <Link to="/tanstack-query">Tnstack Query</Link>
          </li>
        </ul>

        <div>
          <Route path="/home" component={Home} />
          <Route path="/recoil-js" component={Recoiljs} />
          <Route path="/tanstack-query" component={TnstackQuery} />
        </div>
      </div>
    );
  }
}
