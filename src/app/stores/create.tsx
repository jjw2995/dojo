import * as Dialog from "@radix-ui/react-dialog";

function Create() {
    return (
      <Dialog.Root >
        <Dialog.Trigger asChild>
          <button className="text-text text-xl outline rounded-full leading-none p-2 m-2 fixed top-[90%] left-[80%] translate-x-[-50%] translate-y-[-50%]">+</button>
        </Dialog.Trigger>
  
        <Dialog.Portal >
          <Dialog.Overlay />
          <Dialog.Content className="text-text outline fixed h-[70%] rounded-sm w-[70%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
  