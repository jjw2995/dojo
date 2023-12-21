import * as Dialog from "@radix-ui/react-dialog";

function Create() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="fixed left-[80%] top-[90%] m-2 translate-x-[-50%] translate-y-[-50%] rounded-full p-2 leading-none text-text outline">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-[50%] top-[50%] h-[70%] w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-sm text-text outline">
          <div className="m-2">
            <Dialog.Title>create group</Dialog.Title>
            <Dialog.Description />
            <Dialog.Close>??</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
