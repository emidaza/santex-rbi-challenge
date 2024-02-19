import { Container, Paper, styled } from '@mui/material';
import OrderCart from '../order-cart/OrderCart';

const HeaderPaper = styled(Paper)`
  background-color: #10141b;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fff;
`;

const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Header() {
  return (
    <HeaderPaper elevation={1}>
      <HeaderContainer>
        <img
          src="https://santex.wpengine.com/wp-content/uploads/2019/02/logo-santex@3x.png"
          alt="logo"
        />
        <OrderCart></OrderCart>
      </HeaderContainer>
    </HeaderPaper>
  );
}
