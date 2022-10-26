import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Home', href: '/vouchers/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <button key={href} type="button" className="btn">
          <Link href={href}>
            <a className="ntext-black btn btn-sm btn-outline-secondary">
              {label}
            </a>
          </Link>
        </button>
      );
    });

  return (
    <header className="p-0 mt-2">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link href="/">
            <a
              href="/"
              className="d-flex align-items-center mb-2 mb-lg-0 text-black text-decoration-none"
            >
              TheVouch
            </a>
          </Link>

          <ul
            style={{ visibility: 'hidden' }}
            className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"
          >
            {links}
          </ul>

          <div className=" text-end d-flex justify-content-end">{links}</div>
        </div>
      </div>
    </header>
  );
};
