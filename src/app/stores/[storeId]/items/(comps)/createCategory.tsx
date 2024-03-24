// "use client";

// import { type SubmitHandler, useForm } from "react-hook-form";
// import { api } from "~/trpc/react";
// // import * as Dialog from "@radix-ui/react-dialog";
// import { Plus } from "lucide-react";

// import { useState } from "react";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "~/components/ui/dialog";

// type CategoryInput = { categoryName: string };

// function CreateCategory() {
//   const [open, setOpen] = useState(false);
//   const form = useForm<CategoryInput>();
//   const stationCreate = api.category.create.useMutation();
//   const utils = api.useUtils();
//   const onSubmit: SubmitHandler<CategoryInput> = (data) => {
//     stationCreate.mutate(
//       { name: data.categoryName },
//       {
//         onSuccess() {
//           void utils.category.get.invalidate();
//           form.reset();
//           setOpen(false);
//         },
//       },
//     );
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 lg:bottom-[2rem] lg:right-[47%]">
//           <Plus />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="">
//         <DialogTitle className="text-center">Add Category</DialogTitle>
//         <form className="py-2" onSubmit={form.handleSubmit(onSubmit)}>
//           <Input
//             placeholder="Station Name"
//             {...form.register("categoryName", { required: true })}
//           />
//           <div className="mt-2 flex flex-row justify-around">
//             <Button type="submit">create</Button>
//           </div>
//         </form>
//         <DialogDescription />
//       </DialogContent>
//     </Dialog>
//   );
// }

// export { CreateCategory };
