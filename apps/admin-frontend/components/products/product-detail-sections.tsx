import { 
  Package, 
  Settings, 
  Info, 
  Tag, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Product } from "./mock-data";
import { DetailSection } from "@corpora/ui";
import Image from "next/image";

export function createProductDetailSections(product: Product): DetailSection[] {
  return [
    {
      icon: Info,
      heading: "Basic Information",
      columns: [
        {
          rows: [
            { label: "Title", value: product.title },
            { label: "Subtitle", value: product.subtitle || "-" },
            { label: "Slug", value: product.slug },
            { label: "Type", value: product.type },
          ],
        },
        {
          rows: [
            { label: "Description", value: product.description || "-" },
          ],
        },
      ],
    },
    {
      icon: Settings,
      heading: "Product Configuration",
      columns: [
        {
          rows: [
            { 
              label: "Requires Image", 
              value: (
                <div className="flex items-center gap-2">
                  {product.requiresImage ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  {product.requiresImage ? "Yes" : "No"}
                </div>
              ) 
            },
            { label: "Max Images", value: product.maxImages?.toString() || "-" },
            { 
              label: "Is Fragile", 
              value: (
                <div className="flex items-center gap-2">
                  {product.isFragile ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  {product.isFragile ? "Yes" : "No"}
                </div>
              ) 
            },
          ],
        },
        {
          rows: [
            { 
              label: "Is Active", 
              value: (
                <div className="flex items-center gap-2">
                  {product.isActive ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  {product.isActive ? "Active" : "Inactive"}
                </div>
              ) 
            },
            { 
              label: "Featured", 
              value: (
                <div className="flex items-center gap-2">
                  {product.featured ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  {product.featured ? "Yes" : "No"}
                </div>
              ) 
            },
            { 
              label: "Bestseller", 
              value: (
                <div className="flex items-center gap-2">
                  {product.bestseller ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  {product.bestseller ? "Yes" : "No"}
                </div>
              ) 
            },
          ],
        },
      ],
    },
    {
      icon: Layers,
      heading: "Categories & Tags",
      columns: [
        {
          rows: [
            { 
              label: "Categories", 
              value: (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map(c => (
                    <span key={c.id} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {c.name}
                    </span>
                  ))}
                  {product.categories.length === 0 && "-"}
                </div>
              )
            },
          ],
        },
        {
          rows: [
            { 
              label: "Tags", 
              value: (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(t => (
                    <span key={t.id} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {t.name}
                    </span>
                  ))}
                  {product.tags.length === 0 && "-"}
                </div>
              )
            },
          ],
        },
      ],
    },
  ];
}
