INSERT INTO guardians (password, last_name, first_name, email, phone) VALUES
(AES_ENCRYPT('gPass1!','polyusecretkeyforAES'), '李', '伟', AES_ENCRYPT('liwei@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138001','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass2@','polyusecretkeyforAES'), '王', '芳', AES_ENCRYPT('wangfang@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138002','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass3#','polyusecretkeyforAES'), '张', '明', AES_ENCRYPT('zhangming@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138003','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass4$','polyusecretkeyforAES'), '赵', '丽', AES_ENCRYPT('zhaoli@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138004','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass5%','polyusecretkeyforAES'), '陈', '强', AES_ENCRYPT('chenqiang@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138005','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass6^','polyusecretkeyforAES'), '刘', '娜', AES_ENCRYPT('liuna@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138006','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass7&','polyusecretkeyforAES'), '孙', '刚', AES_ENCRYPT('sungang@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138007','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass8*','polyusecretkeyforAES'), '周', '静', AES_ENCRYPT('zhoujing@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138008','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass9(','polyusecretkeyforAES'), '吴', '勇', AES_ENCRYPT('wuyong@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138009','polyusecretkeyforAES')),
(AES_ENCRYPT('gPass10)','polyusecretkeyforAES'), '郑', '美', AES_ENCRYPT('zhengmei@guardian.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138010','polyusecretkeyforAES'));

INSERT INTO students (password, last_name, first_name, gender, identification_number, address, email, phone, enrollment_year, guardian_id, guardian_relation) VALUES
(AES_ENCRYPT('sPass01!','polyusecretkeyforAES'), '李', '小明', '男', AES_ENCRYPT('110101200001011234','polyusecretkeyforAES'), AES_ENCRYPT('北京市朝阳区1号','polyusecretkeyforAES'), AES_ENCRYPT('lixm@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139001','polyusecretkeyforAES'), 2020, 1, '父亲'),
(AES_ENCRYPT('sPass02@','polyusecretkeyforAES'), '王', '小红', '女', AES_ENCRYPT('110101200002022345','polyusecretkeyforAES'), AES_ENCRYPT('北京市海淀区2号','polyusecretkeyforAES'), AES_ENCRYPT('wangxh@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139002','polyusecretkeyforAES'), 2020, 2, '母亲'),
(AES_ENCRYPT('sPass03#','polyusecretkeyforAES'), '张', '小刚', '男', AES_ENCRYPT('110101200003033456','polyusecretkeyforAES'), AES_ENCRYPT('北京市丰台区3号','polyusecretkeyforAES'), AES_ENCRYPT('zhangxg@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139003','polyusecretkeyforAES'), 2021, 3, '父亲'),
(AES_ENCRYPT('sPass04$','polyusecretkeyforAES'), '赵', '小丽', '女', AES_ENCRYPT('110101200004044567','polyusecretkeyforAES'), AES_ENCRYPT('北京市西城区4号','polyusecretkeyforAES'), AES_ENCRYPT('zhaoxl@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139004','polyusecretkeyforAES'), 2021, 4, '母亲'),
(AES_ENCRYPT('sPass05%','polyusecretkeyforAES'), '陈', '小强', '男', AES_ENCRYPT('110101200005055678','polyusecretkeyforAES'), AES_ENCRYPT('北京市东城区5号','polyusecretkeyforAES'), AES_ENCRYPT('chenxq@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139005','polyusecretkeyforAES'), 2022, 5, '父亲'),
(AES_ENCRYPT('sPass06^','polyusecretkeyforAES'), '刘', '小娜', '女', AES_ENCRYPT('110101200006066789','polyusecretkeyforAES'), AES_ENCRYPT('北京市石景山区6号','polyusecretkeyforAES'), AES_ENCRYPT('liuxn@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139006','polyusecretkeyforAES'), 2022, 6, '母亲'),
(AES_ENCRYPT('sPass07&','polyusecretkeyforAES'), '孙', '小刚', '男', AES_ENCRYPT('110101200007077890','polyusecretkeyforAES'), AES_ENCRYPT('北京市门头沟区7号','polyusecretkeyforAES'), AES_ENCRYPT('sunxg@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139007','polyusecretkeyforAES'), 2020, 7, '父亲'),
(AES_ENCRYPT('sPass08*','polyusecretkeyforAES'), '周', '小静', '女', AES_ENCRYPT('110101200008088901','polyusecretkeyforAES'), AES_ENCRYPT('北京市房山区8号','polyusecretkeyforAES'), AES_ENCRYPT('zhouxj@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139008','polyusecretkeyforAES'), 2021, 8, '母亲'),
(AES_ENCRYPT('sPass09(','polyusecretkeyforAES'), '吴', '小勇', '男', AES_ENCRYPT('110101200009099012','polyusecretkeyforAES'), AES_ENCRYPT('北京市通州区9号','polyusecretkeyforAES'), AES_ENCRYPT('wuxy@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139009','polyusecretkeyforAES'), 2022, 9, '父亲'),
(AES_ENCRYPT('sPass10)','polyusecretkeyforAES'), '郑', '小美', '女', AES_ENCRYPT('110101200010100123','polyusecretkeyforAES'), AES_ENCRYPT('北京市顺义区10号','polyusecretkeyforAES'), AES_ENCRYPT('zhengxm@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139010','polyusecretkeyforAES'), 2020, 10, '母亲'),

-- 再追加 10 条（ID 11~20）
(AES_ENCRYPT('sPass11!','polyusecretkeyforAES'), '杨', '小华', '男', AES_ENCRYPT('110101200011111234','polyusecretkeyforAES'), AES_ENCRYPT('北京市昌平区11号','polyusecretkeyforAES'), AES_ENCRYPT('yangxh@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139011','polyusecretkeyforAES'), 2021, 1, '父亲'),
(AES_ENCRYPT('sPass12@','polyusecretkeyforAES'), '何', '小雪', '女', AES_ENCRYPT('110101200012122345','polyusecretkeyforAES'), AES_ENCRYPT('北京市大兴区12号','polyusecretkeyforAES'), AES_ENCRYPT('hexs@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139012','polyusecretkeyforAES'), 2022, 2, '母亲'),
(AES_ENCRYPT('sPass13#','polyusecretkeyforAES'), '马', '小龙', '男', AES_ENCRYPT('110101200013133456','polyusecretkeyforAES'), AES_ENCRYPT('北京市平谷区13号','polyusecretkeyforAES'), AES_ENCRYPT('maxl@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139013','polyusecretkeyforAES'), 2020, 3, '父亲'),
(AES_ENCRYPT('sPass14$','polyusecretkeyforAES'), '胡', '小芳', '女', AES_ENCRYPT('110101200014144567','polyusecretkeyforAES'), AES_ENCRYPT('北京市密云区14号','polyusecretkeyforAES'), AES_ENCRYPT('huxf@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139014','polyusecretkeyforAES'), 2021, 4, '母亲'),
(AES_ENCRYPT('sPass15%','polyusecretkeyforAES'), '林', '小峰', '男', AES_ENCRYPT('110101200015155678','polyusecretkeyforAES'), AES_ENCRYPT('北京市延庆区15号','polyusecretkeyforAES'), AES_ENCRYPT('linxf@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139015','polyusecretkeyforAES'), 2022, 5, '父亲'),
(AES_ENCRYPT('sPass16^','polyusecretkeyforAES'), '潘', '小雯', '女', AES_ENCRYPT('110101200016166789','polyusecretkeyforAES'), AES_ENCRYPT('北京市怀柔区16号','polyusecretkeyforAES'), AES_ENCRYPT('panxw@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139016','polyusecretkeyforAES'), 2020, 6, '母亲'),
(AES_ENCRYPT('sPass17&','polyusecretkeyforAES'), '朱', '小雷', '男', AES_ENCRYPT('110101200017177890','polyusecretkeyforAES'), AES_ENCRYPT('北京市海淀区17号','polyusecretkeyforAES'), AES_ENCRYPT('zhuxl@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139017','polyusecretkeyforAES'), 2021, 7, '父亲'),
(AES_ENCRYPT('sPass18*','polyusecretkeyforAES'), '罗', '小琴', '女', AES_ENCRYPT('110101200018188901','polyusecretkeyforAES'), AES_ENCRYPT('北京市朝阳区18号','polyusecretkeyforAES'), AES_ENCRYPT('luoxq@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139018','polyusecretkeyforAES'), 2022, 8, '母亲'),
(AES_ENCRYPT('sPass19(','polyusecretkeyforAES'), '梁', '小杰', '男', AES_ENCRYPT('110101200019199012','polyusecretkeyforAES'), AES_ENCRYPT('北京市西城区19号','polyusecretkeyforAES'), AES_ENCRYPT('liangxj@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139019','polyusecretkeyforAES'), 2020, 9, '父亲'),
(AES_ENCRYPT('sPass20)','polyusecretkeyforAES'), '宋', '小燕', '女', AES_ENCRYPT('110101200020200123','polyusecretkeyforAES'), AES_ENCRYPT('北京市丰台区20号','polyusecretkeyforAES'), AES_ENCRYPT('songxy@student.com','polyusecretkeyforAES'), AES_ENCRYPT('13900139020','polyusecretkeyforAES'), 2021, 10, '母亲');

INSERT INTO staffs (password, last_name, first_name, gender, identification_number, address, email, phone, department, role) VALUES
(AES_ENCRYPT('staff01!','polyusecretkeyforAES'), '黄', '老师', '男', AES_ENCRYPT('110101198001011111','polyusecretkeyforAES'), AES_ENCRYPT('北京市教工楼A101','polyusecretkeyforAES'), AES_ENCRYPT('huang@staff.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138101','polyusecretkeyforAES'), '数学系', '讲师'),
(AES_ENCRYPT('staff02@','polyusecretkeyforAES'), '徐', '主任', '女', AES_ENCRYPT('110101198002022222','polyusecretkeyforAES'), AES_ENCRYPT('北京市教工楼B202','polyusecretkeyforAES'), AES_ENCRYPT('xu@staff.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138102','polyusecretkeyforAES'), '语文系', '主任'),
(AES_ENCRYPT('staff03#','polyusecretkeyforAES'), '冯', '辅导员', '男', AES_ENCRYPT('110101198003033333','polyusecretkeyforAES'), AES_ENCRYPT('北京市教工楼C303','polyusecretkeyforAES'), AES_ENCRYPT('feng@staff.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138103','polyusecretkeyforAES'), '学生处', '辅导员'),
(AES_ENCRYPT('staff04$','polyusecretkeyforAES'), '郭', '管理员', '女', AES_ENCRYPT('110101198004044444','polyusecretkeyforAES'), AES_ENCRYPT('北京市教工楼D404','polyusecretkeyforAES'), AES_ENCRYPT('guo@staff.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138104','polyusecretkeyforAES'), '教务处', '管理员'),
(AES_ENCRYPT('staff05%','polyusecretkeyforAES'), '钱', '教授', '男', AES_ENCRYPT('110101198005055555','polyusecretkeyforAES'), AES_ENCRYPT('北京市教工楼E505','polyusecretkeyforAES'), AES_ENCRYPT('qian@staff.com','polyusecretkeyforAES'), AES_ENCRYPT('13800138105','polyusecretkeyforAES'), '物理系', '教授');

INSERT INTO courses (course_name) VALUES
('高等数学'),('大学英语'),('数据结构'),('操作系统'),('计算机网络');

INSERT INTO grades (student_id, course_id, term, grade, comments) VALUES
(1, 1, '2023秋', AES_ENCRYPT('92','polyusecretkeyforAES'), AES_ENCRYPT('表现优秀','polyusecretkeyforAES')),
(1, 2, '2023秋', AES_ENCRYPT('88','polyusecretkeyforAES'), AES_ENCRYPT('口语需加强','polyusecretkeyforAES')),
(2, 1, '2023秋', AES_ENCRYPT('85','polyusecretkeyforAES'), AES_ENCRYPT('基础扎实','polyusecretkeyforAES')),
(3, 3, '2023春', AES_ENCRYPT('90','polyusecretkeyforAES'), AES_ENCRYPT('算法掌握好','polyusecretkeyforAES')),
(4, 4, '2023春', AES_ENCRYPT('78','polyusecretkeyforAES'), AES_ENCRYPT('实验需改进','polyusecretkeyforAES')),
(5, 5, '2023秋', AES_ENCRYPT('94','polyusecretkeyforAES'), AES_ENCRYPT('网络项目优秀','polyusecretkeyforAES')),
(6, 1, '2023秋', AES_ENCRYPT('81','polyusecretkeyforAES'), AES_ENCRYPT('课堂积极','polyusecretkeyforAES')),
(7, 2, '2023秋', AES_ENCRYPT('89','polyusecretkeyforAES'), AES_ENCRYPT('阅读能力强','polyusecretkeyforAES')),
(8, 3, '2023春', AES_ENCRYPT('87','polyusecretkeyforAES'), AES_ENCRYPT('代码规范','polyusecretkeyforAES')),
(9, 4, '2023春', AES_ENCRYPT('93','polyusecretkeyforAES'), AES_ENCRYPT('系统设计佳','polyusecretkeyforAES'));

INSERT INTO disciplinary_records (student_id, `date`, staff_id, descriptions) VALUES
(1, '2023-10-15', 1, AES_ENCRYPT('上课玩手机','polyusecretkeyforAES')),
(3, '2023-11-02', 2, AES_ENCRYPT('作业抄袭','polyusecretkeyforAES')),
(5, '2024-01-20', 3, AES_ENCRYPT('夜不归宿','polyusecretkeyforAES')),
(7, '2024-03-12', 4, AES_ENCRYPT('破坏公物','polyusecretkeyforAES')),
(9, '2024-05-08', 5, AES_ENCRYPT('考试作弊','polyusecretkeyforAES'));