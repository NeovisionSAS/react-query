import { Query } from '../../components/utils';

<Query<string[]> query={`names/`}>
  {({ data, loading, error }) => {
    if (loading) return <div>Loading ...</div>;
    if (error)
      return (
        <div>
          <div>Oops, there was an error</div>
          <div>{error}</div>
        </div>
      );

    return <div>{data}</div>;
  }}
</Query>;
