import Link from 'next/link';

const LandingPage = ({ vouchers, currentUser }) => {
  const voucherList = vouchers.map((voucher, index) => {
    return (
      <div key={voucher.id} className="col-md-6">
        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div className="col p-4 d-flex flex-column position-static">
            <strong className="d-inline-block mb-2 text-primary">
              {voucher.percentageOff}% off!
            </strong>
            <h3 className="mb-0">{voucher.product}</h3>
            <p className="card-text mb-auto">
              {voucher.description.slice(0, 100)}...
            </p>
            <Link href="/vouchers/[voucherId]" as={`vouchers/${voucher.id}`}>
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
              <a className="text-white fw-bold">Explore...</a>
            </Link>
          </p>
          {currentUser ? (
            ''
          ) : (
            <p className="lead mb-0">
              <Link href="/auth/signup">
                <a className="text-white fw-bold">Join today...</a>
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="row mb-2">{voucherList}</div>
      <footer className="border-top py-2 my-4 footer  container">
        <p className="text-center text-muted">MSc. 2022.</p>
      </footer>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/vouchers');

  return { vouchers: data };
};

export default LandingPage;
