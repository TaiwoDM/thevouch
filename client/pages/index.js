import Link from 'next/link';

const LandingPage = ({ homes, currentUser }) => {
  const homeList = homes.map((home, index) => {
    return (
      <div key={home.id} className="col-md-6">
        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div className="col p-4 d-flex flex-column position-static">
            <strong className="d-inline-block mb-2 text-primary">
              {home.percentageOff}% off!
            </strong>
            <h3 className="mb-0">{home.product}</h3>
            <p className="card-text mb-auto">
              {home.description.slice(0, 100)}...
            </p>
            <Link href="/homes/[homeId]" as={`homes/${home.id}`}>
              <a>View full detail</a>
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <div className="p-4 p-md-5 mb-4 rounded text-bg-dark">
        <div className="col-md-6 px-0">
          <h1 className="display-4 fst-italic">TheVouch</h1>
          <p className="lead my-3">
            Valid vouchers for top products and services at exciting rates...
          </p>
          <p className="lead mb-0">
            <Link href="/">
              <a className="text-white fw-bold">Explore....</a>
            </Link>
          </p>
          <p className="lead mb-0">
            <Link href="/auth/signup">
              <a className="text-white fw-bold">Join today...</a>
            </Link>
          </p>
        </div>
      </div>

      <div className="row mb-2">{homeList}</div>
      <footer className="border-top py-2 my-4 footer  container">
        <p className="text-center text-muted">MSc. 2022.</p>
      </footer>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/homes');

  console.log(data);

  return { homes: data };
};

export default LandingPage;
