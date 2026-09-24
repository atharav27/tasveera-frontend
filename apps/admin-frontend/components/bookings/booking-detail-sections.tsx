import Link from "next/link";

import { createDetailSections as createSharedDetailSections } from "@corpora/ui";
import type { BookingDetail } from "@corpora/utils";

export function createDetailSections(booking: BookingDetail) {
  return createSharedDetailSections(booking, Link);
}
