import {Component, ViewChild, TemplateRef } from '@angular/core';
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';


@Component({
  templateUrl: 'modals.component.html'
})
export class ModalsComponent {


  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-lg'
  };
  cfmconfig = {
    backdrop: true,
    ignoreBackdropClick: false,
    keyboard: true,
    class: 'modal-sm modal-warning'
  };
  modalRef?: BsModalRef;
  cfmmodalRef?: BsModalRef;

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  constructor(private modalService: BsModalService) {}

  modalOption(whatclose: number, template?: TemplateRef<any>) {
    switch(whatclose) {
      case 0: //confirm close yes
        this.modalRef?.hide()
        this.cfmmodalRef?.hide()
        break
      case 1: //confirm close no
        this.cfmmodalRef?.hide()
        break
      case 2: //open confirm
        this.cfmmodalRef = this.modalService.show(template, this.cfmconfig)
        break
      case 3: //main modal close
        this.modalRef?.hide()
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
}


