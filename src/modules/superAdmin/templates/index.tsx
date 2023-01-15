import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import TemplateListTable from './templateListTable';
import { getTemplates, Template } from '../../../helpers/firestore/templates';

const TemplatesList = () => {
  // eslint-disable-next-line no-unused-vars
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      const templates = await getTemplates();
      setTemplates(templates);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <TemplateListTable templates={templates} isLoading={isLoading} />
    </>
  );
};
export default TemplatesList;
