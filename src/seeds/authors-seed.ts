/**
 * Seed sample authors for Construction Materials News Site
 * Authors with E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals
 */

import mongoose from 'mongoose';
import { Author } from '../models/author.model';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// SAMPLE AUTHORS DATA
// ============================================
const authorsData = [
  {
    name: 'Nguyễn Văn Kiến',
    slug: 'nguyen-van-kien',
    email: 'kien.nguyen@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Kỹ sư xây dựng với hơn 15 năm kinh nghiệm trong lĩnh vực tư vấn và giám sát công trình. Chuyên gia về vật liệu kết cấu, bê tông cường độ cao và công nghệ xây dựng hiện đại. Từng tham gia nhiều dự án cao ốc và công trình hạ tầng lớn tại Việt Nam.',
    shortBio: 'Kỹ sư xây dựng 15+ năm kinh nghiệm, chuyên gia bê tông & vật liệu kết cấu',
    jobTitle: 'Kỹ sư trưởng - Tư vấn giám sát',
    company: 'Công ty CP Tư vấn Xây dựng Việt Nam',
    location: 'TP. Hồ Chí Minh',
    expertise: ['Bê tông cường độ cao', 'Kết cấu thép', 'Giám sát công trình', 'TCVN', 'Vật liệu xây dựng'],
    experience: [
      {
        id: 'exp-1',
        company: 'Công ty CP Tư vấn Xây dựng Việt Nam',
        position: 'Kỹ sư trưởng - Tư vấn giám sát',
        startDate: '2018-01',
        isCurrent: true,
        description: 'Quản lý đội ngũ kỹ sư, tư vấn thiết kế và giám sát thi công các công trình cao tầng',
        location: 'TP. Hồ Chí Minh',
      },
      {
        id: 'exp-2',
        company: 'Tổng công ty Xây dựng số 1',
        position: 'Kỹ sư giám sát',
        startDate: '2010-06',
        endDate: '2017-12',
        description: 'Giám sát thi công phần kết cấu các dự án nhà ở và thương mại',
        location: 'Hà Nội',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách khoa TP.HCM',
        degree: 'Thạc sĩ',
        field: 'Kỹ thuật Xây dựng',
        startYear: 2012,
        endYear: 2014,
      },
      {
        id: 'edu-2',
        school: 'Đại học Xây dựng Hà Nội',
        degree: 'Kỹ sư',
        field: 'Xây dựng Dân dụng & Công nghiệp',
        startYear: 2005,
        endYear: 2010,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Chứng chỉ hành nghề Giám sát thi công xây dựng',
        issuer: 'Bộ Xây dựng',
        issueDate: '2015-03',
      },
      {
        id: 'cert-2',
        name: 'Chứng chỉ hành nghề Thiết kế kết cấu công trình',
        issuer: 'Bộ Xây dựng',
        issueDate: '2016-08',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Giải thưởng Công trình chất lượng cao',
        issuer: 'Bộ Xây dựng',
        date: '2020',
        description: 'Dự án Landmark Tower - Đà Nẵng',
      },
    ],
    skills: [
      { id: 'skill-1', name: 'Bê tông cường độ cao', level: 'expert', yearsOfExperience: 10 },
      { id: 'skill-2', name: 'Revit Structure', level: 'advanced', yearsOfExperience: 8 },
      { id: 'skill-3', name: 'AutoCAD', level: 'expert', yearsOfExperience: 15 },
      { id: 'skill-4', name: 'ETABS', level: 'advanced', yearsOfExperience: 10 },
    ],
    publications: [],
    credentials: 'Thạc sĩ Kỹ thuật Xây dựng, Chứng chỉ hành nghề Giám sát & Thiết kế kết cấu',
    yearsExperience: 15,
    linkedin: 'https://linkedin.com/in/nguyenvankien-xd',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    metaTitle: 'Nguyễn Văn Kiến - Kỹ sư xây dựng, chuyên gia bê tông & kết cấu',
    metaDescription: 'Kỹ sư xây dựng với 15+ năm kinh nghiệm tư vấn giám sát công trình. Chuyên gia về bê tông cường độ cao, kết cấu thép và tiêu chuẩn TCVN.',
  },
  {
    name: 'Trần Minh Hoàng',
    slug: 'tran-minh-hoang',
    email: 'hoang.tran@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Kiến trúc sư với đam mê công trình xanh và kiến trúc bền vững. Hơn 12 năm kinh nghiệm thiết kế các dự án đạt chứng chỉ LEED và LOTUS. Chuyên gia về vật liệu hoàn thiện, facade và giải pháp tiết kiệm năng lượng.',
    shortBio: 'Kiến trúc sư 12 năm kinh nghiệm, chuyên gia công trình xanh LEED/LOTUS',
    jobTitle: 'Kiến trúc sư trưởng',
    company: 'Green Architecture Studio',
    location: 'Hà Nội',
    expertise: ['Kiến trúc xanh', 'LEED', 'LOTUS', 'Facade', 'Vật liệu hoàn thiện', 'BIM'],
    experience: [
      {
        id: 'exp-1',
        company: 'Green Architecture Studio',
        position: 'Kiến trúc sư trưởng',
        startDate: '2019-01',
        isCurrent: true,
        description: 'Dẫn dắt đội ngũ thiết kế các dự án công trình xanh, tư vấn LEED/LOTUS',
        location: 'Hà Nội',
      },
      {
        id: 'exp-2',
        company: 'Aedas Vietnam',
        position: 'Senior Architect',
        startDate: '2014-03',
        endDate: '2018-12',
        description: 'Thiết kế kiến trúc các dự án thương mại và văn phòng quy mô lớn',
        location: 'TP. Hồ Chí Minh',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Kiến trúc Hà Nội',
        degree: 'Kiến trúc sư',
        field: 'Kiến trúc',
        startYear: 2007,
        endYear: 2012,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'LEED AP BD+C',
        issuer: 'USGBC',
        issueDate: '2017-06',
        credentialId: '10987654',
      },
      {
        id: 'cert-2',
        name: 'LOTUS AP',
        issuer: 'VGBC',
        issueDate: '2019-02',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Giải Vàng Kiến trúc Xanh Việt Nam',
        issuer: 'Hội Kiến trúc sư Việt Nam',
        date: '2021',
      },
    ],
    skills: [
      { id: 'skill-1', name: 'Revit Architecture', level: 'expert', yearsOfExperience: 10 },
      { id: 'skill-2', name: 'SketchUp', level: 'expert', yearsOfExperience: 12 },
      { id: 'skill-3', name: 'Rhino/Grasshopper', level: 'advanced', yearsOfExperience: 6 },
      { id: 'skill-4', name: 'LEED Consulting', level: 'expert', yearsOfExperience: 7 },
    ],
    publications: [
      {
        id: 'pub-1',
        title: 'Xu hướng kiến trúc xanh tại Việt Nam',
        publisher: 'Tạp chí Kiến trúc',
        date: '2022-05',
      },
    ],
    credentials: 'Kiến trúc sư, LEED AP BD+C, LOTUS AP',
    yearsExperience: 12,
    website: 'https://greenarchstudio.vn',
    linkedin: 'https://linkedin.com/in/tranminhhoang-arch',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    metaTitle: 'Trần Minh Hoàng - Kiến trúc sư, chuyên gia công trình xanh LEED/LOTUS',
    metaDescription: 'Kiến trúc sư với 12 năm kinh nghiệm thiết kế công trình xanh. Chứng chỉ LEED AP BD+C và LOTUS AP.',
  },
  {
    name: 'Lê Thị Hương',
    slug: 'le-thi-huong',
    email: 'huong.le@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Chuyên gia phân tích thị trường vật liệu xây dựng với 10 năm kinh nghiệm. Tốt nghiệp Đại học Kinh tế Quốc dân, chuyên ngành Kinh tế Xây dựng. Thường xuyên cập nhật và phân tích xu hướng giá cả, nguồn cung vật liệu xây dựng tại Việt Nam.',
    shortBio: 'Chuyên gia phân tích thị trường VLXD 10 năm kinh nghiệm',
    jobTitle: 'Trưởng phòng Phân tích thị trường',
    company: 'Viện Vật liệu Xây dựng',
    location: 'Hà Nội',
    expertise: ['Phân tích thị trường', 'Giá vật liệu', 'Kinh tế xây dựng', 'Dự báo xu hướng'],
    experience: [
      {
        id: 'exp-1',
        company: 'Viện Vật liệu Xây dựng',
        position: 'Trưởng phòng Phân tích thị trường',
        startDate: '2020-01',
        isCurrent: true,
        description: 'Nghiên cứu và phân tích thị trường vật liệu xây dựng, xuất bản báo cáo định kỳ',
        location: 'Hà Nội',
      },
      {
        id: 'exp-2',
        company: 'Hiệp hội Xi măng Việt Nam',
        position: 'Chuyên viên phân tích',
        startDate: '2014-06',
        endDate: '2019-12',
        description: 'Phân tích thị trường xi măng, dự báo nhu cầu và sản lượng',
        location: 'Hà Nội',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Kinh tế Quốc dân',
        degree: 'Thạc sĩ',
        field: 'Kinh tế Xây dựng',
        startYear: 2016,
        endYear: 2018,
      },
      {
        id: 'edu-2',
        school: 'Đại học Kinh tế Quốc dân',
        degree: 'Cử nhân',
        field: 'Kinh tế Đầu tư',
        startYear: 2010,
        endYear: 2014,
      },
    ],
    certifications: [],
    achievements: [],
    skills: [
      { id: 'skill-1', name: 'Phân tích thị trường', level: 'expert', yearsOfExperience: 10 },
      { id: 'skill-2', name: 'Excel nâng cao', level: 'expert', yearsOfExperience: 10 },
      { id: 'skill-3', name: 'Power BI', level: 'advanced', yearsOfExperience: 5 },
    ],
    publications: [
      {
        id: 'pub-1',
        title: 'Báo cáo thị trường VLXD Việt Nam 2024',
        publisher: 'Viện Vật liệu Xây dựng',
        date: '2024-01',
      },
    ],
    credentials: 'Thạc sĩ Kinh tế Xây dựng',
    yearsExperience: 10,
    linkedin: 'https://linkedin.com/in/lethihuong-vlxd',
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    metaTitle: 'Lê Thị Hương - Chuyên gia phân tích thị trường vật liệu xây dựng',
    metaDescription: 'Chuyên gia phân tích thị trường VLXD với 10 năm kinh nghiệm. Cập nhật giá cả và xu hướng vật liệu xây dựng.',
  },
  {
    name: 'Phạm Đức Anh',
    slug: 'pham-duc-anh',
    email: 'anh.pham@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    bio: 'Kỹ sư MEP với 13 năm kinh nghiệm trong lĩnh vực cơ điện công trình. Chuyên gia về hệ thống HVAC, BMS và các giải pháp tiết kiệm năng lượng cho tòa nhà thương mại và công nghiệp. Đã tham gia thiết kế và thi công hệ thống MEP cho nhiều tòa nhà cao tầng và nhà máy.',
    shortBio: 'Kỹ sư MEP 13 năm kinh nghiệm, chuyên gia HVAC & BMS',
    jobTitle: 'Giám đốc Kỹ thuật',
    company: 'MEP Solutions Vietnam',
    location: 'TP. Hồ Chí Minh',
    expertise: ['MEP', 'HVAC', 'BMS', 'Smart Building', 'Tiết kiệm năng lượng', 'IoT'],
    experience: [
      {
        id: 'exp-1',
        company: 'MEP Solutions Vietnam',
        position: 'Giám đốc Kỹ thuật',
        startDate: '2020-03',
        isCurrent: true,
        description: 'Quản lý kỹ thuật, thiết kế và tư vấn hệ thống MEP cho các dự án lớn',
        location: 'TP. Hồ Chí Minh',
      },
      {
        id: 'exp-2',
        company: 'Johnson Controls Vietnam',
        position: 'Senior MEP Engineer',
        startDate: '2015-01',
        endDate: '2020-02',
        description: 'Thiết kế và triển khai hệ thống BMS, HVAC cho các tòa nhà thương mại',
        location: 'TP. Hồ Chí Minh',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách khoa TP.HCM',
        degree: 'Kỹ sư',
        field: 'Kỹ thuật Nhiệt',
        startYear: 2006,
        endYear: 2011,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Certified Energy Manager (CEM)',
        issuer: 'AEE',
        issueDate: '2019-05',
        credentialId: 'CEM-12345',
      },
      {
        id: 'cert-2',
        name: 'BACnet Building Automation',
        issuer: 'BACnet International',
        issueDate: '2018-08',
      },
    ],
    achievements: [],
    skills: [
      { id: 'skill-1', name: 'HVAC Design', level: 'expert', yearsOfExperience: 13 },
      { id: 'skill-2', name: 'BMS Programming', level: 'expert', yearsOfExperience: 8 },
      { id: 'skill-3', name: 'Revit MEP', level: 'advanced', yearsOfExperience: 10 },
      { id: 'skill-4', name: 'Energy Modeling', level: 'advanced', yearsOfExperience: 6 },
    ],
    publications: [],
    credentials: 'Kỹ sư Nhiệt, CEM, BACnet Certified',
    yearsExperience: 13,
    linkedin: 'https://linkedin.com/in/phamducanh-mep',
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    metaTitle: 'Phạm Đức Anh - Kỹ sư MEP, chuyên gia HVAC & Smart Building',
    metaDescription: 'Kỹ sư MEP với 13 năm kinh nghiệm. Chuyên gia về HVAC, BMS và giải pháp tiết kiệm năng lượng cho tòa nhà.',
  },
  {
    name: 'Võ Thanh Tùng',
    slug: 'vo-thanh-tung',
    email: 'tung.vo@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    bio: 'Kỹ sư chống thấm với 18 năm kinh nghiệm thực tế. Chuyên gia về các giải pháp chống thấm, cách âm, cách nhiệt cho mọi loại công trình. Từng xử lý thành công hàng trăm công trình bị thấm dột phức tạp.',
    shortBio: 'Kỹ sư chống thấm 18 năm kinh nghiệm, chuyên gia xử lý thấm dột',
    jobTitle: 'Giám đốc Kỹ thuật',
    company: 'Waterproofing Expert VN',
    location: 'TP. Hồ Chí Minh',
    expertise: ['Chống thấm', 'Cách âm', 'Cách nhiệt', 'Sửa chữa công trình', 'Vật liệu chống thấm'],
    experience: [
      {
        id: 'exp-1',
        company: 'Waterproofing Expert VN',
        position: 'Giám đốc Kỹ thuật',
        startDate: '2015-01',
        isCurrent: true,
        description: 'Tư vấn và thi công chống thấm cho các dự án dân dụng và công nghiệp',
        location: 'TP. Hồ Chí Minh',
      },
      {
        id: 'exp-2',
        company: 'Sika Vietnam',
        position: 'Kỹ sư ứng dụng',
        startDate: '2007-06',
        endDate: '2014-12',
        description: 'Hỗ trợ kỹ thuật và training về sản phẩm chống thấm Sika',
        location: 'TP. Hồ Chí Minh',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách khoa TP.HCM',
        degree: 'Kỹ sư',
        field: 'Vật liệu Xây dựng',
        startYear: 2002,
        endYear: 2007,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Sika Certified Applicator',
        issuer: 'Sika AG',
        issueDate: '2010-03',
      },
      {
        id: 'cert-2',
        name: 'Mapei Technical Specialist',
        issuer: 'Mapei',
        issueDate: '2016-07',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Xử lý thành công thấm tầng hầm Landmark 81',
        date: '2019',
        description: 'Dự án phức tạp với áp lực nước ngầm cao',
      },
    ],
    skills: [
      { id: 'skill-1', name: 'Chống thấm tầng hầm', level: 'expert', yearsOfExperience: 18 },
      { id: 'skill-2', name: 'Chống thấm sân thượng', level: 'expert', yearsOfExperience: 18 },
      { id: 'skill-3', name: 'Xử lý nứt bê tông', level: 'expert', yearsOfExperience: 15 },
    ],
    publications: [],
    credentials: 'Kỹ sư Vật liệu Xây dựng, Sika & Mapei Certified',
    yearsExperience: 18,
    youtube: 'https://youtube.com/@chongthamvn',
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
    metaTitle: 'Võ Thanh Tùng - Kỹ sư chống thấm, 18 năm kinh nghiệm',
    metaDescription: 'Chuyên gia chống thấm với 18 năm kinh nghiệm. Tư vấn và xử lý thấm dột cho mọi loại công trình.',
  },
  {
    name: 'Nguyễn Thị Mai',
    slug: 'nguyen-thi-mai',
    email: 'mai.nguyen@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bio: 'Kỹ sư vật liệu với chuyên môn sâu về gạch, sứ vệ sinh và vật liệu hoàn thiện. 9 năm làm việc tại các nhà máy sản xuất gạch ceramic và porcelain. Hiểu rõ quy trình sản xuất, tiêu chuẩn chất lượng và cách chọn lựa vật liệu phù hợp.',
    shortBio: 'Kỹ sư vật liệu 9 năm, chuyên gia gạch ceramic & porcelain',
    jobTitle: 'Quản lý Kỹ thuật',
    company: 'Viglacera Corporation',
    location: 'Hà Nội',
    expertise: ['Gạch ceramic', 'Gạch porcelain', 'Sứ vệ sinh', 'Vật liệu hoàn thiện', 'QC/QA'],
    experience: [
      {
        id: 'exp-1',
        company: 'Viglacera Corporation',
        position: 'Quản lý Kỹ thuật',
        startDate: '2019-06',
        isCurrent: true,
        description: 'Quản lý chất lượng sản phẩm và hỗ trợ kỹ thuật cho khách hàng',
        location: 'Hà Nội',
      },
      {
        id: 'exp-2',
        company: 'Prime Group',
        position: 'Kỹ sư QC',
        startDate: '2015-08',
        endDate: '2019-05',
        description: 'Kiểm soát chất lượng gạch ceramic trong quá trình sản xuất',
        location: 'Vĩnh Phúc',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách khoa Hà Nội',
        degree: 'Kỹ sư',
        field: 'Công nghệ Vật liệu Silicate',
        startYear: 2011,
        endYear: 2015,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'ISO 9001 Internal Auditor',
        issuer: 'TUV',
        issueDate: '2017-04',
      },
    ],
    achievements: [],
    skills: [
      { id: 'skill-1', name: 'QC gạch ceramic', level: 'expert', yearsOfExperience: 9 },
      { id: 'skill-2', name: 'Phân tích vật liệu', level: 'advanced', yearsOfExperience: 7 },
      { id: 'skill-3', name: 'Tư vấn sản phẩm', level: 'advanced', yearsOfExperience: 5 },
    ],
    publications: [],
    credentials: 'Kỹ sư Vật liệu Silicate, ISO 9001 Auditor',
    yearsExperience: 9,
    facebook: 'https://facebook.com/nguyenthimai.vlxd',
    isActive: true,
    isFeatured: false,
    sortOrder: 6,
    metaTitle: 'Nguyễn Thị Mai - Chuyên gia gạch ceramic và vật liệu hoàn thiện',
    metaDescription: 'Kỹ sư vật liệu với 9 năm kinh nghiệm. Chuyên gia về gạch ceramic, porcelain và vật liệu hoàn thiện.',
  },
  {
    name: 'Đỗ Quang Minh',
    slug: 'do-quang-minh',
    email: 'minh.do@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Chuyên gia BIM với 8 năm kinh nghiệm triển khai BIM cho các dự án xây dựng tại Việt Nam. Giảng viên thỉnh giảng về BIM tại Đại học Xây dựng. Từng làm việc tại Singapore và Malaysia trong các dự án quốc tế.',
    shortBio: 'Chuyên gia BIM 8 năm kinh nghiệm, giảng viên BIM',
    jobTitle: 'BIM Manager',
    company: 'BIM Vietnam JSC',
    location: 'Hà Nội',
    expertise: ['BIM', 'Revit', 'Navisworks', 'Digital Construction', 'Coordination'],
    experience: [
      {
        id: 'exp-1',
        company: 'BIM Vietnam JSC',
        position: 'BIM Manager',
        startDate: '2021-01',
        isCurrent: true,
        description: 'Quản lý và triển khai BIM cho các dự án xây dựng',
        location: 'Hà Nội',
      },
      {
        id: 'exp-2',
        company: 'CPG Corporation (Singapore)',
        position: 'Senior BIM Coordinator',
        startDate: '2017-03',
        endDate: '2020-12',
        description: 'Coordination BIM cho các dự án tại Singapore và Đông Nam Á',
        location: 'Singapore',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Xây dựng Hà Nội',
        degree: 'Kỹ sư',
        field: 'Xây dựng Dân dụng & Công nghiệp',
        startYear: 2012,
        endYear: 2017,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Autodesk Certified Professional - Revit',
        issuer: 'Autodesk',
        issueDate: '2018-09',
        credentialId: 'ACP-REV-2018',
      },
      {
        id: 'cert-2',
        name: 'buildingSMART Professional Certification',
        issuer: 'buildingSMART',
        issueDate: '2020-02',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Best BIM Project Award - Southeast Asia',
        issuer: 'Autodesk',
        date: '2019',
      },
    ],
    skills: [
      { id: 'skill-1', name: 'Revit Architecture', level: 'expert', yearsOfExperience: 8 },
      { id: 'skill-2', name: 'Revit MEP', level: 'expert', yearsOfExperience: 7 },
      { id: 'skill-3', name: 'Navisworks', level: 'expert', yearsOfExperience: 8 },
      { id: 'skill-4', name: 'Dynamo', level: 'advanced', yearsOfExperience: 5 },
    ],
    publications: [
      {
        id: 'pub-1',
        title: 'Ứng dụng BIM trong quản lý thi công xây dựng',
        publisher: 'Tạp chí Xây dựng',
        date: '2021-09',
      },
    ],
    credentials: 'Kỹ sư Xây dựng, Autodesk Certified Professional',
    yearsExperience: 8,
    website: 'https://bimvietnam.vn',
    linkedin: 'https://linkedin.com/in/doquangminh-bim',
    github: 'https://github.com/doquangminh-bim',
    isActive: true,
    isFeatured: true,
    sortOrder: 7,
    metaTitle: 'Đỗ Quang Minh - BIM Manager, chuyên gia Digital Construction',
    metaDescription: 'Chuyên gia BIM với 8 năm kinh nghiệm. Autodesk Certified Professional, giảng viên thỉnh giảng về BIM.',
  },
  {
    name: 'Hoàng Văn Đức',
    slug: 'hoang-van-duc',
    email: 'duc.hoang@vlxd.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    bio: 'Nhà thầu xây dựng với hơn 20 năm kinh nghiệm thi công từ nhà ở đến công trình công nghiệp. Chia sẻ kiến thức thực tế về kỹ thuật thi công, quản lý công trình và lựa chọn vật liệu phù hợp ngân sách.',
    shortBio: 'Nhà thầu 20+ năm kinh nghiệm, chuyên gia thi công thực tế',
    jobTitle: 'Giám đốc',
    company: 'Công ty TNHH Xây dựng Hoàng Đức',
    location: 'TP. Hồ Chí Minh',
    expertise: ['Thi công xây dựng', 'Quản lý công trình', 'Dự toán', 'Nhà ở', 'Công nghiệp'],
    experience: [
      {
        id: 'exp-1',
        company: 'Công ty TNHH Xây dựng Hoàng Đức',
        position: 'Giám đốc',
        startDate: '2010-01',
        isCurrent: true,
        description: 'Điều hành công ty xây dựng, quản lý các dự án thi công',
        location: 'TP. Hồ Chí Minh',
      },
      {
        id: 'exp-2',
        company: 'Công ty CP Xây dựng Bình Minh',
        position: 'Chỉ huy trưởng công trình',
        startDate: '2004-03',
        endDate: '2009-12',
        description: 'Quản lý thi công các công trình dân dụng và công nghiệp',
        location: 'TP. Hồ Chí Minh',
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Kiến trúc TP.HCM',
        degree: 'Kỹ sư',
        field: 'Xây dựng',
        startYear: 1999,
        endYear: 2004,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Chứng chỉ năng lực hoạt động xây dựng hạng II',
        issuer: 'Sở Xây dựng TP.HCM',
        issueDate: '2015-06',
      },
    ],
    achievements: [],
    skills: [
      { id: 'skill-1', name: 'Quản lý thi công', level: 'expert', yearsOfExperience: 20 },
      { id: 'skill-2', name: 'Dự toán công trình', level: 'expert', yearsOfExperience: 20 },
      { id: 'skill-3', name: 'AutoCAD', level: 'intermediate', yearsOfExperience: 15 },
    ],
    publications: [],
    credentials: 'Kỹ sư Xây dựng, Chứng chỉ năng lực hạng II',
    yearsExperience: 20,
    facebook: 'https://facebook.com/xaydunghoangduc',
    isActive: true,
    isFeatured: false,
    sortOrder: 8,
    metaTitle: 'Hoàng Văn Đức - Nhà thầu xây dựng, 20+ năm kinh nghiệm',
    metaDescription: 'Nhà thầu xây dựng với hơn 20 năm kinh nghiệm thi công. Chia sẻ kiến thức thực tế về kỹ thuật và quản lý công trình.',
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedAuthors() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    console.log('\n--- Seeding Authors ---\n');

    for (const authorData of authorsData) {
      // Check if author exists
      const existingAuthor = await Author.findOne({ slug: authorData.slug });

      if (existingAuthor) {
        console.log(`→ Exists: ${authorData.name}`);
        skippedCount++;
        continue;
      }

      // Create author
      await Author.create(authorData);
      console.log(`✓ Created: ${authorData.name}`);
      createdCount++;
    }

    console.log('\n✅ Seed authors completed!');
    console.log(`\nSummary:`);
    console.log(`- Created: ${createdCount} authors`);
    console.log(`- Skipped: ${skippedCount} authors (already exist)`);

    const totalAuthors = await Author.countDocuments();
    console.log(`- Total authors in DB: ${totalAuthors}`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedAuthors();
