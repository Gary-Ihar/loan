import { Button, Col, DatePicker, Form, InputNumber, Row, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';

// общая формула для подсчета процентов на выплату в месяц: (A * B * C) / E = D
// где:
// А - сумма всего кредита
// В - кол-во процентов
// С - кол-во дней в месяце, за который выплата
// Е - кол-во дней в году  в котором месяц выплаты

const MAX_PERCENT = 100;
const MAX_LOAN_AMOUNT = 500_000;

type FormDataType = {
  totalLoanAmount: number;
  percent: number;
  month: Dayjs;
};

export const LoanForm = () => {
  const [form] = Form.useForm<FormDataType>();
  const [credit, setCredit] = useState<number>();

  const onFinish = (data: FormDataType) => {
    const { month, percent, totalLoanAmount } = data;
    const daysInMont = month.daysInMonth();
    const daysInYear = month.isLeapYear() ? 366 : 365;
    const creditResult = (totalLoanAmount * (percent / 100) * daysInMont) / daysInYear;

    setCredit(creditResult);
  };

  return (
    <Form<FormDataType>
      form={form}
      layout="vertical"
      requiredMark
      validateTrigger={['onBlur']}
      onFinish={onFinish}
      initialValues={{
        month: dayjs(),
      }}
    >
      <Row wrap={false} gutter={24}>
        <Col>
          <Form.Item name="totalLoanAmount" label="Сумма" rules={[{ required: true }]} required>
            <InputNumber controls={false} max={MAX_LOAN_AMOUNT} />
          </Form.Item>
          <Form.Item name="month" label="Месяц выплаты" rules={[{ required: true }]} required>
            <DatePicker.MonthPicker />
          </Form.Item>
          <Form.Item name="percent" label="Процент" rules={[{ required: true }]} required>
            <InputNumber step={0.1} max={MAX_PERCENT} precision={2} />
          </Form.Item>
        </Col>
      </Row>
      <Row wrap={false} align="middle" gutter={16}>
        <Col>
          <Button type="primary" ghost onClick={form.submit}>
            Рассчитать
          </Button>
        </Col>
        <Col>
          <Typography.Text>
            Сумма процентов за выбранный месяц:{' '}
            <Typography.Text strong underline>
              {credit?.toFixed(2)}
            </Typography.Text>
          </Typography.Text>
        </Col>
      </Row>
    </Form>
  );
};
