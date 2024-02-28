"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/dialog";
import * as Collapsible from "@radix-ui/react-collapsible";

export default function OrderView({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen m-0 h-screen w-screen gap-0 p-0">
        <div className="mt-12"></div>
        <div className="flex h-screen w-screen flex-col lg:flex-row">
          <div className="flex-1 flex-col">
            <div className=" bg-orange-200 lg:h-[50%]">orderList</div>
          </div>
          <div className="flex-1 bg-green-300">
            <ActionButtons />
            itemList
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ActionButtons() {
  return (
    <div className="fixed w-full bg-red-200">
      <div>actionButtons</div>
      <Collapsible.Root>
        <Collapsible.Content className="relative bg-red-200">
          <div>hidden stuffs</div>
          <div>hidden stuffs</div>
          <div>hidden stuffs</div>
        </Collapsible.Content>
        <Collapsible.Trigger>expend</Collapsible.Trigger>
      </Collapsible.Root>
    </div>
  );
}

// function useClickOutside(ref: React.RefObject<HTMLDivElement>) {
//     const [isClickedOuter, setIsClickedOuter] = useState(false);
//     useEffect(() => {
//       /**
//        * Alert if clicked on outside of element
//        */
//       function handleClickOutside(event: MouseEvent) {
//         if (ref.current && !ref.current.contains(event.target as Node)) {
//           alert("You clicked outside of me!");
//         }
//       }
//       // Bind the event listener
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         // Unbind the event listener on clean up
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [ref]);
//   }
