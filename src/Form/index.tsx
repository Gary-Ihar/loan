import { Button, Col, DatePicker, Form, InputNumber, Row, Table, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getAmountByOnlyPercents } from './utils';

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
  monthlyPayment: number;
  month: Dayjs;
};

type TableItem = {
  date: string;
  amountForPercent: string;
  monthDebt: string; // в счет долга
  mainDebt: string; // остаток основного долга
};

export const LoanForm = () => {
  const [form] = Form.useForm<FormDataType>();
  const [creditData, setCreditData] = useState<{
    credit: number;
    percent: FormDataType['percent'];
    date: Dayjs;
  }>();

  const [tableData, setTableData] = useState<TableItem[]>([]);

  useEffect(() => {
    form.setFieldsValue({
      month: dayjs(),
    });
  }, [form]);

  const onCalculateCreditPaymentByMonth = () => {
    form
      .validateFields(['percent', 'month', 'totalLoanAmount'])
      .then(() => {
        const { month, percent, totalLoanAmount } = form.getFieldsValue();

        setCreditData({
          credit: getAmountByOnlyPercents({
            month,
            percent,
            total: totalLoanAmount,
          }),
          date: month,
          percent,
        });
      })
      .catch((er) => {
        console.warn('Problem with validate form', er);
      });
  };

  const getLoanPlan = () => {
    form.validateFields(['monthlyPayment']).then(() => {
      const { monthlyPayment, month, percent, totalLoanAmount } = form.getFieldsValue();

      let mainDebt: number = totalLoanAmount;
      let iteration = 0;

      const res: TableItem[] = [];

      while (mainDebt > 0) {
        const date = month.add(iteration, 'M');

        const byPercents = getAmountByOnlyPercents({
          month: date,
          percent,
          total: mainDebt,
        });

        const monthDebt = (() => {
          if (monthlyPayment > mainDebt) return mainDebt - byPercents;
          return monthlyPayment - byPercents;
        })();

        mainDebt = (() => {
          if (mainDebt < monthlyPayment - byPercents) {
            return 0;
          } else {
            return mainDebt - (monthlyPayment - byPercents);
          }
        })();

        res.push({
          date: date.format('MMMM, MM.YYYY'),
          mainDebt: mainDebt.toFixed(2),
          monthDebt: monthDebt.toFixed(2),
          amountForPercent: byPercents.toFixed(2),
        });

        iteration++;
      }

      setTableData(res);
    });
  };

  return (
    <Form<FormDataType> form={form} layout="vertical" requiredMark validateTrigger={['onBlur']}>
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
          <Button type="primary" ghost onClick={onCalculateCreditPaymentByMonth}>
            Рассчитать
          </Button>
        </Col>
        <Col>
          <Typography.Text>
            Сумма процентов за выбранный месяц:{' '}
            <Typography.Text strong underline>
              {creditData?.credit.toFixed(2)}
            </Typography.Text>
          </Typography.Text>
        </Col>
      </Row>
      <Row wrap={false} align="middle" gutter={16} style={{ marginTop: 24 }}>
        <Col>
          <Form.Item
            name="monthlyPayment"
            label="Сумма погашения в месяц"
            rules={[
              {
                validator: (_, b) => {
                  if (
                    typeof b === 'number' &&
                    !isNaN(b) &&
                    creditData !== undefined &&
                    !isNaN(creditData.credit) &&
                    creditData.credit > b
                  ) {
                    return Promise.reject('Сумма выплаты должна быть больше суммы процентов');
                  }

                  return Promise.resolve();
                },
              },
              {
                required: true,
              },
            ]}
            required
          >
            <InputNumber controls={false} max={MAX_LOAN_AMOUNT} disabled={creditData === undefined} />
          </Form.Item>
        </Col>
      </Row>
      <Row wrap={false} align="middle" gutter={16}>
        <Col>
          <Button type="primary" ghost onClick={getLoanPlan} disabled={creditData === undefined}>
            Рассчитать
          </Button>
        </Col>
      </Row>
      {!!tableData.length && (
        <Row style={{ marginTop: 24 }}>
          <Table<TableItem>
            rowKey={'date'}
            bordered
            dataSource={tableData}
            columns={[
              {
                dataIndex: 'date',
                title: 'Дата',
              },
              {
                dataIndex: 'mainDebt',
                title: 'Остаток основного долга после платежа',
              },
              {
                dataIndex: 'monthDebt',
                title: 'Сумма оплаты за основной долг',
              },
              {
                dataIndex: 'amountForPercent',
                title: `Сумма за проценты ${creditData?.percent} %`,
              },
            ]}
            pagination={{
              defaultPageSize: 30,
              pageSizeOptions: [30, 50, 100],
            }}
          />
        </Row>
      )}
    </Form>
  );
};
