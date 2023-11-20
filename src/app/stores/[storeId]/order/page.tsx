export default function Page({ params }: { params: { storeId: string } }) {
  return <div>My Post: {params.storeId}</div>;
}
