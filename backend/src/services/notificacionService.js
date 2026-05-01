const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const client = new SNSClient({ region: process.env.AWS_REGION });

const notificarCita = async (cita) => {
  if (!process.env.SNS_TOPIC_ARN) return;
  const command = new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: `Recordatorio: tiene cita el ${cita.fecha} a las ${cita.hora}`,
    Subject: 'Recordatorio de Cita — MediSync'
  });
  await client.send(command);
};

module.exports = { notificarCita };