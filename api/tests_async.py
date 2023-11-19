from test_base import test_base, MC_TASKS, GEN_TASKS, KOR_TASKS

# List of English MC tests that can be executed.
class test_mc_mmlu(test_base):
    @classmethod
    def init(cls):
        cls.task_type = MC_TASKS.MMLU

class test_mc_hellaswag(test_base):
    @classmethod
    def init(cls):
        cls.task_type = MC_TASKS.HELLA_SWAG

class test_mc_arc(test_base):
    @classmethod
    def init(cls):
        cls.task_type = MC_TASKS.ARC


class test_mc_truthfulqa(test_base):
    @classmethod
    def init(cls):
        cls.task_type = MC_TASKS.TRUTHFULQA

# List of English generative tests that can be executed.
class test_gen_lambada(test_base):
    @classmethod
    def init(cls):
        cls.task_type = GEN_TASKS.LAMBADA

class test_gen_truthfulqa(test_base):
    @classmethod
    def init(cls):
        cls.task_type = GEN_TASKS.TRUTHFULQA

# List of Korean tests that can be executed.
class test_quick_kor(test_base):
    @classmethod
    def init(cls):
        cls.task_type = KOR_TASKS.QUICK_KOR

class test_full_kor(test_base):
    @classmethod
    def init(cls):
        cls.task_type = KOR_TASKS.FULL_KOR

# Grouped tests

def get_mc_tests():
    return [test_mc_mmlu, test_mc_hellaswag, test_mc_arc, test_mc_truthfulqa]

def get_gen_tests():
    return [test_gen_lambada, test_gen_truthfulqa]

def get_quick_kor_tests():
    return [test_quick_kor]

def get_full_kor_tests():
    return [test_full_kor]