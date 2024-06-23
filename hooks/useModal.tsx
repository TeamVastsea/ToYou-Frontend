import {Modal, ModalBody, ModalContent,ModalFooter, useDisclosure} from '@nextui-org/modal';
import React, { useEffect, useState } from "react";

export type UseModalBaseProps<T> = {
  visible: boolean,
  props: T
}

export function useModal<T>(options: Partial<UseModalBaseProps<T>> | null, Slot: React.FC<any>){
  const {visible:_visible, props} = options ?? {visible: true, props: {}};
  const {isOpen, onOpenChange, onClose} = useDisclosure({isOpen: _visible});
  const Component = () => {
    const ref = React.useRef<any>();
    const close = () => {
      console.log('close');
      onClose()
      console.log(isOpen)
    };
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Slot ref={ref} {...props} close={close} />
      </Modal>
    );
  }
  return {
    Component
  }
}