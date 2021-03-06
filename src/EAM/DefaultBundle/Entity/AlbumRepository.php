<?php

namespace EAM\DefaultBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * AlbumRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class AlbumRepository extends EntityRepository
{

    public function findAllByDescYear()
    {
        $qb = $this->createQueryBuilder('a')
            ->orderBy('a.date', 'DESC')
            ->getQuery()
        ;

        return $qb->getResult();
    }
}
