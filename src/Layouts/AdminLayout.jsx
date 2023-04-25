import React from 'react'
import PropTypes from 'prop-types'

import { Container, Nav, Navbar, Image } from 'react-bootstrap';
import { logoutUser } from '../services/AuthServices';
import { useNavigate } from 'react-router-dom';

const AdminLayout = props => {
    const navigate = useNavigate()
    return (
        <div>
            <header>
                <Navbar bg="primary" variant='dark' expand="lg">
                    <Container>
                        <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/system/')}>
                            <Image src="/img/logo.svg" height={'50'} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                {
                                    props.isAdmin ? (<>
                                        <Nav.Link onClick={() => navigate('/system/')}>หน้าหลัก</Nav.Link>
                                        <Nav.Link onClick={() => { logoutUser() && navigate('/system/login') }}>ออกจากระบบ</Nav.Link>
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