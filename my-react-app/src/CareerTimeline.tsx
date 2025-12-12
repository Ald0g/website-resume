import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '@/timeline.css'

// Import your logo images
// Place logos in your src/assets/ folder (or adjust the paths accordingly)
import nswLogo from './assets/nswcustomerservice_logo.jpeg';
import westpacLogo from './assets/westpac_logo.jpeg';
import qantasLogo from '@/assets/qantas_logo.jpeg';
import cbaLogo from '@/assets/commonwealthbank_logo.jpeg';
import EngineeringIcon from '@mui/icons-material/Engineering';
// --- DATA-DRIVEN TIMELINE CONFIG ---
const companies = [
  {
    name: 'NSW Department of Customer Service',
    color: '#2196f3',
    textColor: '#FFF',
    logo: nswLogo,
    roles: [
      {
        title: 'Executive Director Spatial Services',
        location: 'Sydney, NSW',
        date: 'Dec 2025 - Present',
        description: '',
      },
      {
        title: 'Executive Director ICT / Digital Sourcing',
        location: 'Sydney, NSW',
        date: 'Jan 2019 - Nov 2025',
        description:
          'Led ICT and digital sourcing operations across NSW Government, developing policy, implementing procurement reform, and driving efficiencies and innovation.',
      },
    ],
  },
  {
    name: 'Westpac',
    color: 'hsla(0, 75%, 51%, 1.00)',
    textColor: '#FFF',
    logo: westpacLogo,
    roles: [
      {
        title: 'Head of Commercial Portfolio — Infrastructure Services',
        location: 'Sydney, NSW',
        date: 'Feb 2013 - Dec 2018',
        description:
          'Managed end-to-end sourcing lifecycle, governance, and commercial oversight for strategic technology partners within the Infrastructure Services portfolio.',
      },
      {
        title: 'Head of Commercial Portfolio — Applications Services',
        location: 'Sydney, NSW',
        date: 'Oct 2008 - Feb 2013',
        description:
          'Oversaw sourcing lifecycle, execution, governance, and commercial management of application services strategic partners.',
      },
    ],
  },
  {
    name: 'Qantas Airways Limited',
    color: 'hsla(0, 70%, 41%, 1.00)',
    textColor: '#FFF',
    logo: qantasLogo,
    roles: [
      {
        title: 'General Manager, Relationship Management',
        location: 'Sydney, NSW',
        date: 'Mar 2007 - Aug 2008',
        description:
          'Responsible for end-to-end sourcing lifecycle, governance, commercial and service delivery management of strategic technology partners.',
      },
    ],
  },
  {
    name: 'Commonwealth Bank of Australia',
    color: '#fbc02d',
    textColor: '#000',
    logo: cbaLogo,
    roles: [
      {
        title: 'Executive Manager, Application Services',
        location: 'Sydney, NSW',
        date: 'Oct 2002 - Mar 2007',
        description:
          'Managed sourcing lifecycle, strategic development, governance, and commercial and contractual management of application services strategic partners.',
      },
    ],
  },
];

export default function CareerTimeline() {
  return (
    <VerticalTimeline>
      {companies.map((company, i) => (
        company.roles.map((role, j) => (
          <VerticalTimelineElement
            key={`${i}-${j}`}
            className="vertical-timeline-element--work"
            contentStyle={{ background: company.color, color: company.textColor}}
            contentArrowStyle={{ borderRight: `7px solid ${company.color}` }}
            date={role.date}
            iconStyle={{ background: '#fff', padding: '4px' }}
            icon={<img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' }} />}
          >
            <h3 className="vertical-timeline-element-title">{role.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{company.name} — {role.location}</h4>
            {role.description && <p>{role.description}</p>}
          </VerticalTimelineElement>
        ))
      ))}

      <VerticalTimelineElement
        iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
        icon={<EngineeringIcon />}
      />
    </VerticalTimeline>
  );
}