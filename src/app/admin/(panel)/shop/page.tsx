import Link from "next/link";
import { adminGetProducts, adminGetOrders } from "@/lib/admin-data";
import { deleteProduct } from "@/app/admin/actions";
import {
  squareConfigured,
  listSquareProducts,
  listSquareOrders
} from "@/lib/square";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { money } from "@/lib/format";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ShopAdminPage() {
  const square = squareConfigured();

  if (square) {
    const [products, orders] = await Promise.all([
      listSquareProducts(),
      listSquareOrders()
    ]);

    return (
      <div>
        <h1 className="text-5xl uppercase">Shop</h1>
        <p className="mt-2 font-body text-sm text-bone/50">
          Catalog and orders are managed in Square — merch and the coffee bar
          share one dashboard. Edit products in Square; they sync here and to
          the public store automatically.
        </p>

        <h2 className="mt-10 text-3xl uppercase">Catalog</h2>
        <div className="mt-4 overflow-x-auto border border-concrete bg-[#0d0d0d]">
          <table className="w-full min-w-[600px] text-left">
            <thead className="font-body text-xs uppercase tracking-[0.15em] text-bone/50">
              <tr className="border-b border-concrete">
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Variations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete font-body text-sm">
              {products.length ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4 text-bone/70">{money(p.price)}</td>
                    <td className="p-4 text-bone/60">
                      {p.sizes?.length ? p.sizes.join(", ") : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-bone/50">
                    No catalog items found in Square.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-3xl uppercase">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto border border-concrete bg-[#0d0d0d]">
          <table className="w-full min-w-[600px] text-left">
            <thead className="font-body text-xs uppercase tracking-[0.15em] text-bone/50">
              <tr className="border-b border-concrete">
                <th className="p-4">Order</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">State</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete font-body text-sm">
              {orders.length ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-4 text-bone/60">{o.id.slice(0, 8)}</td>
                    <td className="p-4 text-bone/60">{o.itemCount}</td>
                    <td className="p-4 text-bone/70">{money(o.total)}</td>
                    <td className="p-4 text-bone/60">{o.state}</td>
                    <td className="p-4 text-bone/50">
                      {formatDateTime(o.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-bone/50">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Fallback: Square not connected — manage products in Supabase.
  const [products, orders] = await Promise.all([
    adminGetProducts(),
    adminGetOrders()
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Shop</h1>
        <Link href="/admin/shop/new" className="btn-primary text-xl">
          + New Product
        </Link>
      </div>
      <p className="mt-3 border border-concrete bg-[#0d0d0d] p-4 font-body text-sm text-bone/60">
        Square is not connected. Set <code>SQUARE_ACCESS_TOKEN</code> and{" "}
        <code>SQUARE_LOCATION_ID</code> to manage merch + coffee from one Square
        dashboard. Until then, products are managed here.
      </p>

      <div className="mt-8 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Sizes</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {products.length ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-[#0d0d0d]">
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4 text-bone/70">{money(p.price)}</td>
                  <td className="p-4 text-bone/60">
                    {p.sizes?.join(", ") || "—"}
                  </td>
                  <td className="p-4">
                    <span className={p.in_stock ? "text-flame" : "text-bone/40"}>
                      {p.in_stock ? "In stock" : "Sold out"}
                    </span>
                  </td>
                  <td className="p-4 text-bone/60">{p.featured ? "Yes" : "—"}</td>
                  <td className="flex items-center gap-4 p-4">
                    <Link
                      href={`/admin/shop/${p.id}`}
                      className="font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={p.id} action={deleteProduct} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-bone/50">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-3xl uppercase">Orders</h2>
      <div className="mt-4 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {orders.length ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-4 text-bone/60">{o.id.slice(0, 8)}</td>
                  <td className="p-4 text-bone/70">{o.customer_email}</td>
                  <td className="p-4 text-bone/60">
                    {Array.isArray(o.items) ? o.items.length : 0} item(s)
                  </td>
                  <td className="p-4 text-bone/70">
                    {o.total != null ? money(o.total) : "—"}
                  </td>
                  <td className="p-4 text-bone/60">{o.status}</td>
                  <td className="p-4 text-bone/50">{o.created_at.slice(0, 10)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-bone/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
