import { Button } from 'ui';

export const Primary = () => (
  <Button href="contact.html" arrow="→">
    預約諮詢
  </Button>
);

export const Ghost = () => (
  <Button variant="ghost" href="#architecture" arrow="↓">
    查看系統架構
  </Button>
);

export const Submit = () => (
  <Button as="button" type="submit" block>
    送出諮詢
  </Button>
);

export const Disabled = () => (
  <Button as="button" disabled>
    處理中…
  </Button>
);
