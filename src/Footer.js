import { Container } from 'semantic-ui-react';

function myFooter() {
  return (
    <footer>
        <Container style={{height: '50px', marginTop: '25px'}} textAlign='center'>
            <p>Copyright &copy; 2023 Blogger All Rights Reserved.</p>
        </Container>
    </footer>
  );
}

export default myFooter;