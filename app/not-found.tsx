import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <h1 className="font-serif text-5xl font-semibold">Style not found</h1>
        <p className="mt-3 text-sm text-neutral-600">This Creative Modista page is unavailable or has moved.</p>
        <Button href="/products" className="mt-6">
          Browse products
        </Button>
      </div>
    </div>
  );
}
