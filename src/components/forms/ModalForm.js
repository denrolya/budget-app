import PropTypes from 'prop-types';
import React from 'react';
import {
  Card, CardBody, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

const ModalForm = ({
  title, isOpen, toggleModal, children,
}) => (
  <Modal centered backdrop size="lg" isOpen={isOpen} toggle={toggleModal}>
    <ModalHeader toggle={toggleModal} tag="h4">
      {title}
    </ModalHeader>
    <ModalBody>
      <Card className="card-white">
        <CardBody>
          {React.cloneElement(children, {
            toggleModal,
          })}
        </CardBody>
      </Card>
    </ModalBody>
  </Modal>
);

ModalForm.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default ModalForm;
