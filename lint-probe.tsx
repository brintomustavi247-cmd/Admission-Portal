import React, { useState } from "react";

/* ✅ purity fix: lazy initializer — render-এ সরাসরি Date.now() নয়।
   Initializer function শুধু mount-এ একবার চলে, তাই render idempotent থাকে
   (ref: src/components/FreePeriodPopup.tsx, src/components/AppGate.tsx)। */
export const ProbeDateEager: React.FC = () => {
  const [now] = useState(() => Date.now());
  return <div>{now}</div>;
};
