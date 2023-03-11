import React from 'react'
import PropTypes from 'prop-types'

import { Container, NavDropdown, Nav, Navbar, Image } from 'react-bootstrap';

const AdminLayout = props => {
    return (
        <div>
            <header>
                <Navbar bg="primary" variant='dark' expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">
                            <Image src="/img/logo.svg" height={'50'} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {
                                    props.isAdmin ? (<>
                                        <Nav.Link href="#home">Home</Nav.Link>
                                        <Nav.Link href="#link">Link</Nav.Link>
                                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.2">
                                                Another action
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item href="#action/3.4">
                                                Separated link
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>) : null
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <main>
                {props.children}
            </main>
            <footer></footer>
        </div>
    )
}

AdminLayout.propTypes = {
    children: PropTypes.element.isRequired,
    isAdmin: PropTypes.bool
}

AdminLayout.defaultProps = {
    isAdmin: false
}

export default AdminLayout