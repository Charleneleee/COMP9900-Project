DROP TYPE IF EXISTS pillar_type CASCADE;
CREATE TYPE pillar_type AS ENUM ('E', 'S', 'G');

DROP TYPE IF EXISTS unit_type CASCADE;
CREATE TYPE unit_type AS ENUM (
    'Cubic meters',
    'Cubic meters / million EUR of revenue of investee companies',
    'GJ',
    'Hours/employee',
    'Injured / million hours',
    'Non / audit USD / audit USD',
    'Number of breaches',
    'Number of days',
    'Number of fatalities',
    'Ratio',
    'Tons',
    'Tons CO2',
    'Tons CO2e',
    'Tons of NOx',
    'Tons of SOx',
    'Tons of VOC',
    'USD',
    'USD (000)',
    'USD donated per million of revenue USD',
    '%',
    '% growth in number of employees over last year',
    'Yes/No'
);

DROP TABLE IF EXISTS metrics;
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pillar pillar_type NOT NULL,
    description TEXT NOT NULL,
    unit unit_type NOT NULL
);


INSERT INTO metrics (name, pillar, description, unit)
VALUES (
        'AIRPOLLUTANTS_DIRECT',
        'E',
        'External cost of pollutants released to air by the consumption of fossil fuels and production processes which are owned or controlled by the company. Direct external environmental impacts are those impacts that a company has on the environment through its own activities. Trucost applies monetary VALUES to air pollutant quantities, which represents the global average damage of each environmental impact. All VALUES employed are secondary - the synthesis of existing published and unpublished literature.',
        'USD (000)'
    ),
    (
        'AIRPOLLUTANTS_INDIRECT',
        'E',
        'External cost of indirect emissions of pollutants to the air by the consumption of fossil fuels and production processes.',
        'USD (000)'
    ),
    (
        'ANALYTICAUDITCOMMIND',
        'G',
        'Percentage of independent board members on the audit committee as stipulated by the company.',
        '%'
    ),
    (
        'ANALYTICBOARDFEMALE',
        'G',
        'Percentage of females on the board.',
        '%'
    ),
    (
        'ANALYTICCEO_CHAIRMAN_SEPARATION',
        'G',
        'Does the CEO simultaneously chair the board or has the chairman of the board been the CEO of the company?',
        'Yes/No'
    ),
    (
        'ANALYTICCOMPCOMMIND',
        'G',
        'Percentage of independent board members on the compensation committee as stipulated by the company.',
        '%'
    ),
    (
        'ANALYTICCSR_COMP_INCENTIVES',
        'G',
        'Is the senior executive''s compensation linked to CSR/H&S/Sustainability targets?',
        'Yes/No'
    ),
    (
        'ANALYTICEMPLOYMENTCREATION',
        'G',
        'Employment growth over the last year.',
        '% growth in number of employees over last year'
    ),
    (
        'ANALYTICESTIMATEDCO2TOTAL',
        'E',
        'The estimated total CO2 and CO2 equivalents emission in tons. Total CO2e Emissions (Scope 1 + Scope 2 + Scope 3)',
        'Tons CO2e'
    ),
    (
        'ANALYTICINDEPBOARD',
        'G',
        'Percentage of independent board members as reported by the company.',
        '%'
    ),
    (
        'ANALYTICNOMINATIONCOMMIND',
        'G',
        'Percentage of non-executive board members on the nomination committee.',
        '%'
    ),
    (
        'ANALYTICNONAUDITAUDITFEESRATIO',
        'G',
        'All non-audit fees divided by the audit and audit-related fees paid to the group auditor.',
        'Non / audit USD / audit USD'
    ),
    (
        'ANALYTICNONEXECBOARD',
        'G',
        'Percentage of non-executive board members.',
        '%'
    ),
    (
        'ANALYTICQMS',
        'G',
        'Does the company claim to apply quality management systems, such as ISO 9000, Six Sigma, Lean Manufacturing, Lean Sigma, TQM or any other similar quality principles?',
        'Yes/No'
    ),
    (
        'ANALYTICTOTALDONATIONS',
        'S',
        'Total amount of all donations divided by net sales or revenue.',
        'USD donated per million of revenue USD'
    ),
    (
        'ANALYTICWASTERECYCLINGRATIO',
        'E',
        'Total recycled and reused waste produced in tons divided by total waste produced in tons.',
        '%'
    ),
    (
        'ANALYTIC_ANTI_TAKEOVER_DEVICES',
        'G',
        'The number of anti-takeover devices in place in excess of two.',
        'Yes/No'
    ),
    (
        'ANALYTIC_AUDIT_COMM_EXPERTISE',
        'G',
        'Does the company have an audit committee with at least three members and at least one "financial expert" within the meaning of Sarbanes-Oxley?',
        'Yes/No'
    ),
    (
        'ANALYTIC_VOTING_RIGHTS',
        'G',
        'Are all shares of the company providing equal voting rights?',
        'Yes/No'
    ),
    (
        'ANIMAL_TESTING_REDUCTION',
        'S',
        'Has the company established a program or an initiative to reduce, phase out or substitute for animal testing?',
        'Yes/No'
    ),
    (
        'ANNUAL_MEDIAN_COMPENSATION',
        'G',
        'Median annual compensation for the entire company, excluding the highest paid employee.',
        'USD'
    ),
    (
        'AUDITCOMMNONEXECMEMBERS',
        'G',
        'Percentage of non-executive board members on the audit committee as stipulated by the company.',
        '%'
    ),
    (
        'AVGTRAININGHOURS',
        'G',
        'Average hours of training per year per employee.',
        'Hours/employee'
    ),
    (
        'BIODIVERSITY_IMPACT_REDUCTION',
        'E',
        'Does the company report on its impact on biodiversity or on activities to reduce its impact on the native ecosystems and species, as well as the biodiversity of protected and sensitive areas?',
        'Yes/No'
    ),
    (
        'BOARDMEETINGATTENDANCEAVG',
        'G',
        'The average overall attendance percentage of board meetings as reported by the company.',
        '%'
    ),
    (
        'BRIBERY_AND_CORRUPTION_PAI_INSUFFICIENT_ACTIONS',
        'G',
        'Cases of insufficient action taken to address breaches of standards of anti-corruption and anti-bribery.',
        'Yes/No'
    ),
    (
        'CALL_MEETINGS_LIMITED_RIGHTS',
        'G',
        'Has the company limited the rights of shareholders to call special meetings?',
        'Yes/No'
    ),
    (
        'CEO_ANNUAL_COMPENSATION',
        'G',
        'Total annual compensation for the highest paid individual (normally the CEO).',
        'USD'
    ),
    (
        'CEO_PAY_RATIO_MEDIAN',
        'G',
        'Already reported ratio of CEO compensation over median annual employee compensation.',
        'Ratio'
    ),
    (
        'CLIMATE_CHANGE_RISKS_OPP',
        'E',
        'Is the company aware that climate change can represent commercial risks and/or opportunities?',
        'Yes/No'
    ),
    (
        'CO2DIRECTSCOPE1',
        'E',
        'Scope 1 emissions that occur within a company''s organizational boundary from sources that the company owns or controls in tons of CO2e.',
        'Tons CO2e'
    ),
    (
        'CO2INDIRECTSCOPE2',
        'E',
        'Scope 2 emissions that result from the generation of purchased electricity, heating, cooling, and steam in tons of CO2e.',
        'Tons CO2e'
    ),
    (
        'CO2INDIRECTSCOPE3',
        'E',
        'Scope 3 emissions that occur in the value chain of the reporting company in tons of CO2e.',
        'Tons CO2e'
    ),
    (
        'CO2_NO_EQUIVALENTS',
        'E',
        'The estimated total CO2 emission in tons (without counting CO2 equivalents).',
        'Tons CO2'
    ),
    (
        'COMMMEETINGSATTENDANCEAVG',
        'G',
        'The average overall attendance percentage of board committee meetings as reported by the company.',
        '%'
    ),
    (
        'COMPCOMMNONEXECMEMBERS',
        'G',
        'Percentage of non-executive board members on the compensation committee as stipulated by the company.',
        '%'
    ),
    (
        'CONFORMANCE_OECD_MNE',
        'S',
        'Does the company claim to follow the OECD Guidelines for Multinational Enterprises?',
        'Yes/No'
    ),
    (
        'CONFORMANCE_UN_GUID',
        'S',
        'Does the company have clear reference to conformance with the UN Guiding Principles on Business and Human Rights?',
        'Yes/No'
    ),
    (
        'CSR_REPORTINGGRI',
        'G',
        'Is the company''s CSR report published in accordance with the GRI guidelines?',
        'Yes/No'
    ),
    (
        'CSR_REPORTING_EXTERNAL_AUDIT',
        'G',
        'Does the company have an external auditor of its CSR/H&S/Sustainability report?',
        'Yes/No'
    ),
    (
        'DAY_CARE_SERVICES',
        'S',
        'Does the company claim to provide day care services for its employees?',
        'Yes/No'
    ),
    (
        'ECO_DESIGN_PRODUCTS',
        'E',
        'Does the company report on specific products which are designed for reuse, recycling or the reduction of environmental impacts?',
        'Yes/No'
    ),
    (
        'ELECTRICITYPURCHASED',
        'E',
        'Electricity purchased in gigajoules.',
        'GJ'
    ),
    (
        'ELIMINATION_CUM_VOTING_RIGHTS',
        'G',
        'Has the company reduced or eliminated cumulative voting in regard to the election of board members?',
        'Yes/No'
    ),
    (
        'EMPLOYEEFATALITIES',
        'S',
        'Number of employee fatalities resulting from operational accidents.',
        'Number of fatalities'
    ),
    (
        'EMPLOYEE_HEALTH_SAFETY_POLICY',
        'S',
        'Does the company have a policy to improve employee health & safety?',
        'Yes/No'
    ),
    (
        'EMS_CERTIFIED_PCT',
        'E',
        'The percentage of company sites or subsidiaries that are certified with any environmental management system.',
        '%'
    ),
    (
        'ENERGYPURCHASEDDIRECT',
        'E',
        'Direct energy purchased in gigajoules.',
        'GJ'
    ),
    (
        'ENERGYUSETOTAL',
        'E',
        'Total energy consumed by a company within its operational control, including energy produced and purchased (e.g., electricity, steam, natural gas, coal, oil).',
        'GJ'
    ),
    (
        'ENV_INVESTMENTS',
        'E',
        'Does the company report on making proactive environmental investments or expenditures to reduce future risks or increase future opportunities?',
        'Yes/No'
    ),
    (
        'ENV_SUPPLY_CHAIN_MGT',
        'E',
        'Does the company use environmental criteria (ISO 14000, energy consumption, etc.) in the selection process of its suppliers or sourcing partners?',
        'Yes/No'
    ),
    (
        'E_WASTE_REDUCTION',
        'E',
        'Does the company report on initiatives to recycle, reduce, reuse, substitute, treat or phase out e-waste?',
        'Yes/No'
    ),
    (
        'GENDER_PAY_GAP_PERCENTAGE',
        'S',
        'Percentage of remuneration of women to men.',
        '%'
    ),
    (
        'GLOBAL_COMPACT',
        'G',
        'Has the company signed the UN Global Compact?',
        'Yes/No'
    ),
    (
        'GRIEVANCE_REPORTING_PROCESS',
        'S',
        'Does the company have a formal grievance reporting process for concerns reporting misconduct or ethical concerns?',
        'Yes/No'
    ),
    (
        'HAZARDOUSWASTE',
        'E',
        'Total amount of hazardous waste produced in tons.',
        'Tons'
    ),
    (
        'HUMAN_RIGHTS_CONTRACTOR',
        'S',
        'Does the company report or show to use human rights criteria in the selection or monitoring process of its suppliers or sourcing partners?',
        'Yes/No'
    ),
    (
        'HUMAN_RIGHTS_POLICY_DUEDILIGENCE',
        'S',
        'Does the company have a due diligence process in place to prevent/ act upon human right abuses? Both in its operations and suppliers'' operations?',
        'Yes/No'
    ),
    (
        'HUMAN_RIGHTS_VIOLATION_PAI',
        'S',
        'Number of identified cases of severe human rights issues and incidents.',
        'Number of breaches'
    ),
    (
        'IMPROVEMENT_TOOLS_BUSINESS_ETHICS',
        'S',
        'Does the company have appropriate communication tools (whistle blower, ombudsman, suggestion box, hotline, newsletter, website, etc.) to improve general business ethics?',
        'Yes/No'
    ),
    (
        'ISO14000',
        'S',
        'Does the company claim to have an ISO 14000 or EMS certification?',
        'Yes/No'
    ),
    (
        'LABELED_WOOD',
        'E',
        'Does the company claim to produce, source or distribute wood or forest products that are labeled (e.g., Forest Stewardship Council (FSC))?',
        'Yes/No'
    ),
    (
        'LOSTWORKINGDAYS',
        'S',
        'Total working days lost by the workforce (employees and contractors), due to some form of incapacity, including occupational diseases and injuries.',
        'Number of days'
    ),
    (
        'NATURAL_RESOURCE_USE_DIRECT',
        'E',
        'External cost of the direct extraction of minerals, metals, natural gas, oil, coal, forestry, agriculture and aggregates by the company. Direct external environmental impacts are those impacts that a company has on the environment through its own activities.',
        'USD (000)'
    ),
    (
        'NOXEMISSIONS',
        'E',
        'Total amount of NOx emissions emitted in tons.',
        'Tons of NOx'
    ),
    (
        'N_OXS_OX_EMISSIONS_REDUCTION',
        'E',
        'Does the company report on initiatives to reduce, reuse, recycle, substitute, or phase out SOx (sulfur oxides) or NOx (nitrogen oxides) emissions?',
        'Yes/No'
    ),
    (
        'ORGANIC_PRODUCTS_INITIATIVES',
        'E',
        'Does the company report or show initiatives to produce or promote organic food or other products?',
        'Yes/No'
    ),
    (
        'PARTICULATE_MATTER_EMISSIONS',
        'E',
        'Amount of particulate matter (a complex mixture of small liquid droplets and solid particulates suspended in the air) emitted by the company.',
        'Tons'
    ),
    (
        'POLICY_BOARD_DIVERSITY',
        'S',
        'Does the company have a policy regarding the gender diversity of its board?',
        'Yes/No'
    ),
    (
        'POLICY_BRIBERYAND_CORRUPTION',
        'S',
        'Does the company have a policy and/or processes in place to avoid bribery and corruption in all its operations?',
        'Yes/No'
    ),
    (
        'POLICY_BUSINESS_ETHICS',
        'S',
        'Does the company describe in the code of conduct that it strives to maintain the highest level of general business ethics?',
        'Yes/No'
    ),
    (
        'POLICY_CHILD_LABOR',
        'S',
        'Does the company have a policy to avoid the use of child labor?',
        'Yes/No'
    ),
    (
        'POLICY_DATA_PRIVACY',
        'S',
        'Does the company have a policy to protect customer and general public privacy and integrity?',
        'Yes/No'
    ),
    (
        'POLICY_EMISSIONS',
        'E',
        'Does the company have a policy to improve emission reduction?',
        'Yes/No'
    ),
    (
        'POLICY_FORCED_LABOR',
        'S',
        'Does the company have a policy to avoid the use of forced labor?',
        'Yes/No'
    ),
    (
        'POLICY_FREEDOMOF_ASSOCIATION',
        'S',
        'Does the company describe, claim to have or mention the processes in place to ensure the freedom of association of its employees?',
        'Yes/No'
    ),
    (
        'POLICY_HUMAN_RIGHTS',
        'S',
        'Does the company have a policy to ensure the respect of human rights in general?',
        'Yes/No'
    ),
    (
        'POLICY_SUSTAINABLE_PACKAGING',
        'E',
        'Does the company have a policy to improve its use of sustainable packaging?',
        'Yes/No'
    ),
    (
        'POLICY_WATER_EFFICIENCY',
        'E',
        'Does the company have a policy to improve its water efficiency?',
        'Yes/No'
    ),
    (
        'RENEWENERGYCONSUMED',
        'E',
        'Total renewable energy consumed in Gigajoules.',
        'GJ'
    ),
    (
        'RENEWENERGYPRODUCED',
        'E',
        'Total renewable energy produced for self-consumption in Gigajoules.',
        'GJ'
    ),
    (
        'RENEWENERGYPURCHASED',
        'E',
        'Total renewable energy purchased for self-consumption in Gigajoules.',
        'GJ'
    ),
    (
        'SOXEMISSIONS',
        'E',
        'Total amount of SOx emissions emitted in tons.',
        'Tons of SOx'
    ),
    (
        'SUPPLY_CHAINHS_POLICY',
        'S',
        'Does the company have a policy to improve employee health & safety in its supply chain?',
        'Yes/No'
    ),
    (
        'SUSTAINABLE_BUILDING_PRODUCTS',
        'E',
        'Does the company develop products and services that improve the energy efficiency of buildings?',
        'Yes/No'
    ),
    (
        'TAKEBACK_RECYCLING_INITIATIVES',
        'E',
        'Does the company reports about take-back procedures and recycling programs to reduce the potential risks of products entering the environment?',
        'Yes/No'
    ),
    (
        'TARGETS_DIVERSITY_OPPORTUNITY',
        'S',
        'Has the company set targets or objectives to be achieved on diversity and equal opportunity?',
        'Yes/No'
    ),
    (
        'TARGETS_EMISSIONS',
        'E',
        'Has the company set targets or objectives to be achieved on emission reduction?',
        'Yes/No'
    ),
    (
        'TARGETS_WATER_EFFICIENCY',
        'E',
        'Has the company set targets or objectives to be achieved on water efficiency?',
        'Yes/No'
    ),
    (
        'TIRTOTAL',
        'S',
        'Rate of total number of injuries (Total Injury Rate TIR) and fatalities in the workforce (employees and contractors) relative to 1 million hours worked.',
        'Injured / million hours'
    ),
    (
        'TOXIC_CHEMICALS_REDUCTION',
        'E',
        'Does the company report on initiatives to reduce, reuse, substitute or phase out toxic chemicals or substances?',
        'Yes/No'
    ),
    (
        'TRADEUNIONREP',
        'S',
        'Percentage of employees represented by independent trade union organizations or covered by collective bargaining agreements.',
        '%'
    ),
    (
        'TRANALYTICRENEWENERGYUSE',
        'E',
        'Total energy consumed from primary renewable energy sources divided by total energy consumed.',
        '%'
    ),
    (
        'TURNOVEREMPLOYEES',
        'S',
        'Percentage of employee turnover.',
        '%'
    ),
    (
        'VOCEMISSIONS',
        'E',
        'Amount of Volatile Organic Compounds (VOC) emitted by the company.',
        'Tons of VOC'
    ),
    (
        'VOC_EMISSIONS_REDUCTION',
        'E',
        'Does the company report on initiatives to reduce, substitute, or phase out volatile organic compounds (VOC)?',
        'Yes/No'
    ),
    (
        'WASTETOTAL',
        'E',
        'Total amount of waste produced in tons.',
        'Tons'
    ),
    (
        'WASTE_RECYCLED',
        'E',
        'Total waste that is generated by the company and is recycled, reused or composted.',
        'Tons'
    ),
    (
        'WASTE_REDUCTION_TOTAL',
        'E',
        'Does the company report on initiatives to recycle, reduce, reuse, substitute, treat or phase out total waste?',
        'Yes/No'
    ),
    (
        'WATERWITHDRAWALTOTAL',
        'E',
        'Total water withdrawal in cubic meters.',
        'Cubic meters'
    ),
    (
        'WATER_TECHNOLOGIES',
        'E',
        'Does the company develop products or technologies that are used for water treatment, purification or that improve water use efficiency?',
        'Yes/No'
    ),
    (
        'WATER_USE_PAI_M10',
        'E',
        'Average amount of water consumed and reclaimed by the investee companies.',
        'Cubic meters / million EUR of revenue of investee companies'
    ),
    (
        'WHISTLEBLOWER_PROTECTION',
        'S',
        'Does the company have a provision or comply with regulations protecting whistleblowers?',
        'Yes/No'
    ),
    (
        'WOMENEMPLOYEES',
        'S',
        'Percentage of women employees.',
        '%'
    ),
    (
        'WOMENMANAGERS',
        'S',
        'Percentage of women managers.',
        '%'
    );