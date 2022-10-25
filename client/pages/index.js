import Link from 'next/link';

const LandingPage = ({ homes, currentUser }) => {
  const homeList = homes.map((home) => {
    return (
      // <tr key={home.id}>
      //   <td>{home.title}</td>
      //   <td>{home.price}</td>
      //   <td>${home.percentageOff}</td>
      //   <td>
      //     <Link href="/homes/[homeId]" as={`homes/${home.id}`}>
      //       <a>View</a>
      //     </Link>
      //   </td>
      // </tr>

      <div class="col-md-6">
        <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div class="col p-4 d-flex flex-column position-static">
            <strong class="d-inline-block mb-2 text-primary">
              {home.percentageOff}% off!
            </strong>
            <h3 class="mb-0">{home.title}</h3>
            <div class="mb-1 text-muted">Nov 12</div>
            <p class="card-text mb-auto">{home.description}</p>
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
      <div class="p-4 p-md-5 mb-4 rounded text-bg-dark">
        <div class="col-md-6 px-0">
          <h1 class="display-4 fst-italic">
            Title of a longer featured blog post
          </h1>
          <p class="lead my-3">
            Multiple lines of text that form the lede, informing new readers
            quickly and efficiently about what’s most interesting in this post’s
            contents.
          </p>
          <p class="lead mb-0">
            <a href="#" class="text-white fw-bold">
              Continue reading...
            </a>
          </p>
        </div>
      </div>

      <div class="row mb-2">{homeList}</div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/homes');

  return { homes: data };
};

export default LandingPage;
