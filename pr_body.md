## Related Issues
Closes #54

## Changes
**Frontend API** (d761ac6): Added favorites.ts and statistics.ts to connect to BE Wishlist and Carbon Index APIs.
**Frontend UI** (d761ac6): Updated ImpactPage to fetch dynamic carbon index data and removed redundant mock components.
**Frontend UI** (d761ac6): Fixed shop page out-of-stock items not updating by refetching products on navigation.
**Frontend UI** (d761ac6): Fixed shop page sorting by adding 'newest' sort option and casting price/carbonIndex to numeric values.
**Frontend UI** (348e97e): Added global CSS hover/active pointer cursors.
**Frontend Routing** (348e97e): Used sessionStorage to persist activePage across reloads.
